// DOMContentLoaded: 웹 브라우저가 HTML 문서를 전부 읽고 DOM 트리를 완성한 직후에 실행될 코드를 지정합니다.
// 스크립트가 HTML 요소보다 먼저 실행되어 요소를 찾지 못하는 오류를 방지하는 가장 일반적인 방법입니다.
document.addEventListener('DOMContentLoaded', () => {

    // --- 전역 변수 설정 --- //
    // 이 스크립트의 여러 함수에서 공통적으로 사용될 변수들을 미리 선언하고 값을 할당합니다.

    // querySelector를 사용해 클래스 이름이 'main_object'인 SVG 요소를 찾아서 svg 변수에 할당합니다.
    const svg = document.querySelector('.main_object');
    // querySelector를 사용해 클래스 이름이 'main'인 main 태그 요소를 찾아서 mainElement 변수에 할당합니다.
    const mainElement = document.querySelector('main');
    // 위에서 찾은 svg 요소 내부에서 <g> 태그를 찾아 svgGroup 변수에 할당합니다. 궤적들이 이 그룹 안에 추가됩니다.
    const svgGroup = svg.querySelector('g');
    // SVG 요소를 동적으로 생성할 때 필요한 XML 네임스페이스 주소를 svgNS 변수에 저장합니다.
    const svgNS = "http://www.w3.org/2000/svg";
    // HTML에서 'data-original="true"' 속성을 가진 모든 <path> 요소를 찾습니다.
    // querySelectorAll은 NodeList를 반환하므로, Array.from을 사용해 이를 실제 배열로 변환하여 originalPaths에 저장합니다.
    const originalPaths = Array.from(svg.querySelectorAll('path[data-original="true"]'));
    // 동적으로 생성될 추가 궤적들을 담아둘 빈 배열을 선언합니다.
    const extraPaths = [];
    // 생성할 최대 궤적의 개수를 140개로 제한합니다. (원본 궤적 15개 사이의 14개 공간 * steps 10개 = 140개)
    const MAX_DENSITY_LEVEL = 140;

    // --- 마우스 인터랙션 관련 변수 --- //

    // 마우스가 SVG 영역에 처음 진입한 시점의 x좌표를 저장할 변수입니다. null은 아직 진입하지 않았음을 의미합니다.
    let entryX = null;
    // 인터랙션이 100%에 도달하는 지점을 설정합니다. 0.89는 오른쪽 끝에서 11%만큼 안쪽을 의미합니다.
    const activeRatio = 0.89;


    // --- 함수 정의 --- //

    /**
     * 추가될 중간 궤적(path)들을 미리 생성하여 extraPaths 배열에 저장하는 함수입니다.
     * 성능을 위해, 마우스를 움직일 때마다 궤적을 생성하는 대신, 페이지 로드 시 한 번만 실행됩니다.
     */
    function createExtraPaths() {
        // 1. 원본 궤적들의 데이터를 추출하고 정렬합니다.
        const originalPathData = originalPaths.map(p => ({
            element: p, // 원본 path 요소 자체
            d: p.getAttribute('d'), // path의 모양을 결정하는 d 속성값
            center: getPathCenter(p.getAttribute('d')) // path의 시작점 x좌표 (중심점으로 사용)
        })).sort((a, b) => a.center - b.center); // 중심점 x좌표를 기준으로 왼쪽에서 오른쪽으로 오름차순 정렬

        // 2. 중간 궤적들을 생성하여 임시 배열에 저장합니다.
        let generatedPaths = []; // 생성된 궤적들을 임시로 담을 배열

        // 정렬된 원본 궤적들을 순회하며 각 궤적 쌍 (pathA, pathB) 사이에 중간 궤적들을 생성합니다.
        for (let i = 0; i < originalPathData.length - 1; i++) {
            const pathA = originalPathData[i]; // 시작 궤적
            const pathB = originalPathData[i+1]; // 끝 궤적

            const steps = 10; // 두 궤적 사이에 생성할 중간 궤적의 개수 (촘촘함 결정)
            for (let j = 1; j <= steps; j++) {
                // t는 두 궤적 사이의 상대적 위치를 나타내는 값입니다. (0.0 ~ 1.0)
                const t = j / steps; // 0.1, 0.2, ..., 1.0
                // 두 궤적의 d 속성값을 보간하여 새로운 중간 궤적의 d 값을 계산합니다.
                const newD = interpolatePathD(pathA.d, pathB.d, t);
                
                // 3. 계산된 d 값으로 새로운 <path> 요소를 동적으로 생성합니다.
                const newPath = document.createElementNS(svgNS, 'path'); // SVG 전용 path 요소 생성
                newPath.setAttribute('d', newD); // 계산된 모양(d) 설정
                newPath.setAttribute('stroke', 'url(#paint0_linear_206_507)'); // 선 색상 설정
                newPath.setAttribute('stroke-opacity', '1'); // 선 투명도 설정
                newPath.setAttribute('stroke-miterlimit', '10'); // 선의 모서리 처리 방식 설정
                newPath.setAttribute('stroke-width', '1'); // 선 두께 설정
                newPath.setAttribute('fill', 'none'); // 채우기 없음 설정
                newPath.style.display = 'none'; // 일단 보이지 않도록 숨김 처리
                
                // 4. 생성된 path를 SVG 그룹과 배열에 추가합니다.
                svgGroup.appendChild(newPath); // SVG 그룹(<g>)의 자식 요소로 추가하여 화면에 표시될 준비
                generatedPaths.push(newPath); // 임시 배열에 추가
            }
        }

        // 5. 최종 궤적 배열을 준비합니다.
        // 모든 생성된 궤적들을 다시 한번 x좌표 기준으로 정렬합니다. (안정성을 위해)
        generatedPaths.sort((a, b) => {
            const aCenter = getPathCenter(a.getAttribute('d'));
            const bCenter = getPathCenter(b.getAttribute('d'));
            return aCenter - bCenter;
        });
        
        // 최종적으로 사용할 궤적들을 extraPaths 배열에 저장합니다. slice로 최대 개수를 제한합니다.
        extraPaths.push(...generatedPaths.slice(0, MAX_DENSITY_LEVEL));
    }

    /**
     * path의 d 속성 문자열에서 시작점의 x좌표를 추출하는 보조 함수입니다.
     * @param {string} d - path의 d 속성값 (예: "M100 50C...")
     * @returns {number} - 추출된 x좌표 (예: 100)
     */
    function getPathCenter(d) {
        const match = d.match(/^M([\d\.]+)/); // 정규표현식으로 'M'으로 시작하는 숫자 부분을 찾음
        return match ? parseFloat(match[1]) : 0; // 찾은 문자열을 실수로 변환하여 반환, 없으면 0 반환
    }

    /**
     * 두 숫자 사이의 특정 지점(t)에 있는 값을 계산하는 선형 보간(Linear Interpolation) 함수입니다.
     * @param {number} num1 - 시작 숫자
     * @param {number} num2 - 끝 숫자
     * @param {number} t - 위치 (0.0 ~ 1.0)
     * @returns {number} - 보간된 숫자
     */
    function interpolate(num1, num2, t) {
        return num1 * (1 - t) + num2 * t; // t=0이면 num1, t=1이면 num2, t=0.5이면 둘의 평균을 반환
    }

    /**
     * 두 path의 d 속성값을 보간하여 새로운 d 값을 만들어내는 함수입니다.
     * @param {string} d1 - 시작 path의 d 값
     * @param {string} d2 - 끝 path의 d 값
     * @param {number} t - 위치 (0.0 ~ 1.0)
     * @returns {string} - 보간된 새로운 d 값
     */
    function interpolatePathD(d1, d2, t) {
        const nums1 = d1.match(/[\d\.]+/g).map(Number); // d1 문자열에서 모든 숫자(소수점 포함)를 추출하여 숫자 배열로 변환
        const nums2 = d2.match(/[\d\.]+/g).map(Number); // d2 문자열에서 숫자들을 추출
        if (nums1.length !== nums2.length) return d1; // 두 궤적의 숫자 개수가 다르면 보간이 불가능하므로 중단

        // 두 숫자 배열의 각 항목을 하나씩 순서대로 보간합니다.
        const interpolatedNums = nums1.map((n, i) => interpolate(n, nums2[i], t));
        
        // 보간된 숫자 배열을 다시 SVG path d 속성 형식의 문자열로 조립하여 반환합니다.
        return `M${interpolatedNums[0]} ${interpolatedNums[1]}C${interpolatedNums[2]} ${interpolatedNums[3]} ${interpolatedNums[4]} ${interpolatedNums[5]} ${interpolatedNums[6]} ${interpolatedNums[7]}C${interpolatedNums[8]} ${interpolatedNums[9]} ${interpolatedNums[10]} ${interpolatedNums[11]} ${interpolatedNums[12]} ${interpolatedNums[13]}C${interpolatedNums[14]} ${interpolatedNums[15]} ${interpolatedNums[16]} ${interpolatedNums[17]} ${interpolatedNums[18]} ${interpolatedNums[19]}C${interpolatedNums[20]} ${interpolatedNums[21]} ${interpolatedNums[22]} ${interpolatedNums[23]} ${interpolatedNums[24]} ${interpolatedNums[25]}Z`;
    }


    // --- 이벤트 리스너(Event Listener) 설정 --- //
    // 사용자의 입력(마우스 움직임, 휠 등)에 반응하는 코드를 설정합니다.

    // 1. SVG 영역에 마우스가 처음 들어왔을 때 실행될 이벤트
    svg.addEventListener('mouseenter', (e) => {
        // SVG 요소의 경계 정보를 가져옵니다.
        const svgBounds = svg.getBoundingClientRect();
        // 마우스가 들어온 SVG 내의 상대적인 x좌표를 계산하여 '시작점'으로 기록합니다.
        entryX = e.clientX - svgBounds.left;

        // 인터랙션을 새로 시작하기 위해 모든 추가 궤적을 숨깁니다.
        extraPaths.forEach(path => {
            path.style.display = 'none';
        });
    });

    // 2. SVG 영역 안에서 마우스가 움직일 때마다 계속해서 실행될 이벤트
    svg.addEventListener('mousemove', (e) => {
        // 마우스가 들어온 기록(entryX)이 없으면 아무것도 하지 않습니다. (페이지 로드 직후 등 예외 처리)
        if (entryX === null) return;

        // SVG 요소의 현재 크기와 위치 정보를 가져옵니다.
        const svgBounds = svg.getBoundingClientRect();
        // 현재 마우스의 SVG 내 상대적 x좌표를 계산합니다.
        const mouseX = e.clientX - svgBounds.left;

        // 실제 인터랙션이 일어날 전체 너비 범위를 계산합니다.
        // (시작점부터 오른쪽 끝 여백을 제외한 지점까지)
        const interactionWidth = (svgBounds.width * activeRatio) - entryX;

        // 시작점으로부터 오른쪽으로 얼마나 이동했는지 거리를 계산합니다.
        const deltaX = mouseX - entryX;

        // 이동한 거리를 전체 인터랙션 너비에 대한 비율(0.0 ~ 1.0)로 변환합니다.
        // Math.max(0, ...)는 시작점보다 왼쪽으로 갔을 때 음수가 되지 않도록 0으로 고정합니다.
        // Math.min(1, ...)는 오른쪽 끝을 넘어갔을 때 1을 넘지 않도록 1로 고정합니다.
        const ratio = Math.max(0, Math.min(1, deltaX / interactionWidth));

        // 계산된 비율에 따라 현재 보여줘야 할 궤적의 개수를 정합니다.
        const pathsToShow = Math.floor(ratio * extraPaths.length);

        // extraPaths 배열을 순회하며, 보여줄 개수(pathsToShow)만큼 궤적을 화면에 표시합니다.
        extraPaths.forEach((path, index) => {
            // 현재 궤적의 인덱스가 보여줄 개수보다 작으면 block(보임), 그렇지 않으면 none(숨김) 처리합니다.
            path.style.display = index < pathsToShow ? 'block' : 'none';
        });
    });

    // 3. SVG 영역에서 마우스가 나갔을 때 실행될 이벤트
    svg.addEventListener('mouseleave', () => {
        // 마우스가 영역을 떠나면 시작점 기록을 리셋합니다.
        entryX = null;
        // 모든 추가 궤적을 다시 숨깁니다.
        extraPaths.forEach(path => {
            path.style.display = 'none';
        });
    });

    // 4. 페이지 전체에서 마우스 휠을 굴렸을 때 실행될 이벤트
    window.addEventListener('wheel', (e) => {
        // 휠을 위로 올릴 때: e.deltaY < 0, 페이지가 최상단일 때: window.scrollY === 0
        if (e.deltaY < 0 && window.scrollY === 0) {
            e.preventDefault(); // 기본 스크롤 동작(바운스 등)을 막습니다.
            mainElement.classList.add('zoom_out'); // main 요소에 'zoom_out' 클래스를 추가하여 줌아웃 애니메이션을 실행합니다.
        }
        // 휠을 아래로 내릴 때: e.deltaY > 0, 현재 줌아웃 상태일 때: mainElement.classList.contains('zoom_out-out')
        else if (e.deltaY > 0 && mainElement.classList.contains('zoom_out')) {
            e.preventDefault(); // 페이지가 바로 아래로 스크롤되는 것을 막습니다.
            mainElement.classList.remove('zoom_out'); // 'zoom_out' 클래스를 제거하여 원래 상태로 돌아가는 애니메이션을 실행합니다.
        }
    });


    // --- 스크립트 실행 --- //
    // 페이지가 처음 로드될 때, 인터랙션에 필요한 궤적들을 미리 생성하는 함수를 호출합니다.
    createExtraPaths();
        });