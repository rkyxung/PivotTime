"use client";

// ===== SECTION =====
// Curriculum 페이지 전용 스타일 임포트
import "../styles/curriculum.scss";

const INTRO_INFO = [
  { headline: "KAYWON UNIVERSITY OF ARTS & DESIGN", detail: "DIGITAL MEDIA DESIGN" },
  { headline: "DIGITAL-MEDIA.KR", detail: "degree-show/2025" },
  { headline: "KAYWON DESIGN HALL 5F", detail: "Nov. 21. FRI - Nov. 23. SUN" },
];

const CONVERGENCE_NOTES = [
  "전공융합 실무프로젝트 교육과정",
  "산업체 연계 NCS 기반 커리큘럼",
  "실무 프로젝트/경진대회 경험 강화",
  "창의 융합형 전공 트랙 운영",
  "정량·정성 평가 기반 교육 설계",
];

const FOUNDATION_TRACKS = [
  { title: "입문과정", semesters: [{ stage: "1-1", courses: ["영상 기초"] }, { stage: "1-2", courses: ["무빙그래픽스"] }, { stage: "2-1", courses: ["멀티미디어 메이킹"] }, { stage: "2-2", courses: ["현장 실무", "프로젝트 워크"] }] },
  { title: "기획", semesters: [{ stage: "1-1", courses: ["기획 기초"] }, { stage: "1-2", courses: ["콘텐츠 조사/분석"] }, { stage: "2-1", courses: ["소셜 캠페이닝", "브랜드 커뮤니케이션"] }, { stage: "2-2", courses: ["프로젝트 전략", "프로젝트 매니징"] }] },
  { title: "디자인", semesters: [{ stage: "1-1", courses: ["디자인 기초"] }, { stage: "1-2", courses: ["콘셉트 디자인"] }, { stage: "2-1", courses: ["인터페이스 디자인", "UI/UX 레이아웃"] }, { stage: "2-2", courses: ["경험 디자인", "인터랙션 디자인"] }] },
  { title: "프로그래밍", semesters: [{ stage: "1-1", courses: ["프로그래밍 기초"] }, { stage: "1-2", courses: ["라이브코딩 기초"] }, { stage: "2-1", courses: ["유니티 프로그래밍", "데이터 기반 코딩"] }, { stage: "2-2", courses: ["실험 3D 코드", "서비스 프로토타입"] }] },
  { title: "스튜디오", semesters: [{ stage: "1-1", courses: ["실감미디어 기초"] }, { stage: "1-2", courses: ["디지털 영상 제작"] }, { stage: "2-1", courses: ["미디어 프로토타이핑", "UX 스튜디오"] }, { stage: "2-2", courses: ["프로젝트 스튜디오", "서비스 프로토타입"] }] },
];

const ADVANCED_PROGRAM = [
  { title: "전공심화", stages: [{ label: "3-1", items: ["통합 애틀라스 디자인", "타이포그래피", "디지털 미디어 세미나", "스마트콘텐츠"] }, { label: "3-2", items: ["디지털 환경디자인", "커뮤니케이션 기획", "디지털 프로덕트 다이빙", "실감 콘셉트 연구"] }, { label: "4-1", items: ["뉴미디어 시각콘텐츠", "뉴미디어 퍼포먼스", "내러티브 인터페이스", "실험적 미디어랩"] }, { label: "4-2", items: ["프로젝트 연구", "전략 & 브랜딩"] }] },
  { title: "전공선택", stages: [{ label: "3-1", items: ["디지털 인터랙션", "타이포그래피", "디지털 비주얼 스토리", "스마트콘텐츠 프로젝트"] }, { label: "3-2", items: ["커뮤니케이션 리서치", "UX 전략 워크숍", "VR/AR 콘셉트 연구", "실감 스토리텔링"] }, { label: "4-1", items: ["프로토타입 연구", "커뮤니케이션 리서치", "디지털 프로젝트 다이빙"] }, { label: "4-2", items: ["디지털 감성 연구", "프로젝트 스튜디오", "서비스 플랫폼"] }] },
];

const CAREER_FIELDS = [
  { title: "디지털미디어 기획/전략", roles: ["서비스 · 콘셉트 기획자", "UX/UI 기획자", "디지털 캠페인 플래너", "채널전략 디렉터", "AI 기반 CX 디자이너", "브랜드 전략가"] },
  { title: "크리에이티브", roles: ["콘텐츠 크리에이터", "유튜브 크리에이터", "SNS 크리에이터", "라이브커머스 크리에이터", "카이로스 & 크로스미디어"] },
  { title: "모션 그래픽", roles: ["무빙 그래픽 디자이너", "온에어 그래픽 디자이너", "브랜드 그래픽 디자이너", "공간 그래픽 디자이너", "실감미디어 그래픽 디자이너"] },
  { title: "실감 미디어", roles: ["체험 전시 디자이너", "실감 콘텐츠 프로듀서", "VR/AR 콘텐츠 기획자", "VR/AR 인터랙션 디자이너", "VR/AR 콘텐츠 프로그래머"] },
  { title: "전략", roles: ["정보/조사분석 컨설턴트", "해외 문화관광 전략 기획", "브랜딩 컨설턴트", "글로벌 커뮤니케이터"] },
];

export default function Curriculum() {
  return (
    <main className="curriculum">
      {/* ===== HERO SECTION ===== */}
      <section className="curriculum__intro">
        {/* === SVG: Hero symbol placeholder (사용자 삽입) === */}
        <div className="hero-symbol-placeholder" aria-hidden="true">
          {/* SVG 삽입 공간: 사용자가 직접 넣을 위치 */}
        </div>

        <h1 className="curriculum__hero-title">DIGITAL MEDIA DESIGN</h1>
        <p className="curriculum__hero-copy">
          디지털미디어디자인과는 디지털과 공간 기술, 그리고 미디어의 융합 교육과 신유형 콘텐츠 창작을 중심으로 창의적인 융합형 인재를 양성합니다.
        </p>

        <div className="curriculum__info-row">
          {INTRO_INFO.map((info) => (
            <div className="curriculum__info-card" key={info.headline}>
              <span>{info.headline}</span>
              <strong>{info.detail}</strong>
            </div>
          ))}
        </div>

        <div className="curriculum__scroll-guide">
          <span>SCROLL DOWN</span>
          <i />
        </div>
      </section>

      {/* ===== CONVERGENCE / DIAGRAM SECTION ===== */}
      <section className="curriculum__diagram">
        <div className="diagram-wrapper">
          {/* 중앙 3원 다이어그램 (CSS로 구현) */}
          <div className="diagram">
            <div className="diagram-circle diagram-circle--design">DESIGN</div>
            <div className="diagram-circle diagram-circle--media">MEDIA</div>
            <div className="diagram-circle diagram-circle--tech">TECHNOLOGY</div>

            {/* 다이어그램 메모(왼쪽 텍스트) */}
            <div className="diagram-notes">
              {CONVERGENCE_NOTES.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </div>

          {/* 왼쪽·오른쪽 그래픽(플레이스홀더; 실제 오브젝트는 SVG로 대체 가능) */}
          <div className="left-deco" aria-hidden="true">{/* SVG 영역 표시용 */}</div>
          <div className="right-deco" aria-hidden="true">{/* SVG 영역 표시용 */}</div>
        </div>

        <div className="diagram-caption">● CONVERGENCE EDUCATION ●</div>
      </section>

      {/* ===== FOUNDATION / CURRICULUM GRID ===== */}
      <section className="curriculum__foundation">
        <header className="section-heading">● CURRICULUM ●</header>
        <div className="foundation-grid">
          {FOUNDATION_TRACKS.map((track) => (
            <div className="foundation-column" key={track.title}>
              <div className="foundation-head">{track.title}</div>
              <div className="foundation-body">
                {track.semesters.map((semester, idx) => (
                  <div className="foundation-semester" data-first={idx === 0 ? "true" : "false"} key={`${track.title}-${semester.stage}`}>
                    <span className="foundation-stage">{semester.stage}</span>
                    <div className="foundation-course-block">
                      {semester.courses.map((course) => (
                        <div className="foundation-course" key={course}>{course}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ADVANCED PROGRAM ===== */}
      <section className="curriculum__advanced">
        {ADVANCED_PROGRAM.map((group) => (
          <div className="advanced-column" key={group.title}>
            <div className="advanced-head">{group.title}</div>
            <div className="advanced-body">
              {group.stages.map((stage, idx) => (
                <div className="advanced-stage-block" data-first={idx === 0 ? "true" : "false"} key={`${group.title}-${stage.label}`}>
                  <span className="advanced-stage">{stage.label}</span>
                  <div className="advanced-courses">
                    {stage.items.map((item) => (
                      <div className="advanced-course" key={item}>{item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ===== CAREER SECTION ===== */}
      <section className="curriculum__career">
        <header className="section-heading">● CAREER ●</header>
        <div className="career-grid">
          {CAREER_FIELDS.map((field) => (
            <div className="career-column" key={field.title}>
              <div className="career-head">{field.title}</div>
              <div className="career-body">
                {field.roles.map((role) => (
                  <div className="career-item" key={role}>{role}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 오른쪽 하단 장식(토러스/원형 뭉치 CSS 데코) */}
        <div className="career-deco" aria-hidden="true"></div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="curriculum__footer">
        <div className="curriculum__footer-logo">PIVOTTIME</div>
        <div className="curriculum__footer-info">
          <span>16038 경기도 의왕시 계원대학로 66 계원예술대학교</span>
          <span>ⓒ 2025. Digital media design PIVOTTIME All Right Reserved.</span>
        </div>
        <div className="curriculum__footer-contact">
          <span>TEL. 031-420-1190</span>
          <span>FAX. 1899-5823</span>
          <span>E-MAIL. kaywon@kaywon.ac.kr</span>
        </div>
      </footer>
    </main>
  );
}
