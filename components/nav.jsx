// Next.js의 클라이언트 사이드 렌더링을 활성화하여 상호작용적인 UI를 만듭니다.
"use client";

// 리액트의 필수 기능들을 가져옵니다.
import {
  // 여러 요소를 감싸는 데 사용되는 특별한 컴포넌트로, 불필요한 DOM 요소를 추가하지 않습니다.
  Fragment,
  // 함수를 메모리에 저장하여 컴포넌트가 다시 렌더링될 때 불필요한 함수 재생성을 방지하는 최적화 기능입니다.
  useCallback,
  // 화면에 변경사항이 그려지기 전에 동기적으로 실행되는 훅으로, DOM 측정이나 조작에 사용됩니다.
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import "../styles/nav.scss";

// 네비게이션 탭에 표시될 아이템들의 정보(id와 텍스트)를 배열로 미리 정의합니다.
const TAB_ITEMS = [
  // 'GET FEVER' 탭의 고유 식별자(id)와 화면에 표시될 이름(label)을 설정합니다.
  { id: "fever", label: "GET FEVER" },
  // 'GO PIVOT' 탭의 고유 식별자(id)와 화면에 표시될 이름(label)을 설정합니다.
  { id: "pivot", label: "GO PIVOT" },
];

const NAV_ITEMS = [
    { id: "project", content: "Project" },
    {
      id: "line1",
      type: "separator",
      content: (
        <svg
          width="0.1vw"
          height="1.24vw"
          viewBox="0 0 2 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path opacity="0.2" d="M1.45801 0.84375V23.4277" stroke="white" />
        </svg>
      ),
    },
    { id: "student", content: "Student" },
    {
      id: "hamburger",
      content: (
        <svg
          width="1.55vw"
          height="1.35vw"
          viewBox="0 0 28 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5.0249 7H23.0278" strokeWidth="2" />
          <path d="M5.0249 13H23.0278" strokeWidth="2" />
          <path d="M5.0249 19H23.0278" strokeWidth="2" />
        </svg>
      ),
    },
  ];

// 다른 파일에서 이 네비게이션 컴포넌트를 사용할 수 있도록 Nav 함수를 기본으로 내보냅니다.
export default function Nav() {
  // Tab_Switcher 상태
  const [activeTab, setActiveTab] = useState("none");
  const [hoveredTab, setHoveredTab] = useState(null);
  const containerRef = useRef(null);
  const markerRef = useRef(null);
  const tabRefs = useRef({});

  // .nav 상태
  const [activeNavTab, setActiveNavTab] = useState(null);
  const [hoveredNavTab, setHoveredNavTab] = useState(null);
  const navContainerRef = useRef(null);
  const navMarkerRef = useRef(null);
  const navTabRefs = useRef({});

  const [isToggled, setIsToggled] = useState(false);

  const highlightTarget = activeTab !== "none" ? activeTab : hoveredTab;
  const highlightNavTarget = activeNavTab !== null ? activeNavTab : hoveredNavTab;

  const handleLogoClick = () => {
    setActiveTab("none");
    setActiveNavTab(null);
  };

  const handleTabToggle = (tabId) => {
    if (activeTab === tabId) return; // 이미 활성화된 탭이면 아무것도 하지 않음
    setActiveTab(tabId);
    setActiveNavTab(null); // 다른 네비게이션 메뉴 비활성화
  };

  const handleNavTabToggle = (tabId) => {
    if (activeNavTab === tabId) return; // 이미 활성화된 탭이면 아무것도 하지 않음
    setActiveNavTab(tabId);
    setActiveTab("none"); // 다른 네비게이션 메뉴 비활성화
  };

  const handleToggle = () => {
    setIsToggled((current) => !current);
  };

  const animateMarker = useCallback(() => {
    const marker = markerRef.current;
    const container = containerRef.current;
    if (!marker || !container) return;

    const targetId = highlightTarget;
    if (!targetId) {
      gsap.to(marker, { opacity: 0, duration: 0.25, ease: "power2.out" });
      return;
    }

    const targetEl = tabRefs.current[targetId];
    if (!targetEl) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const x = targetRect.left - containerRect.left;
    const width = targetRect.width;

    const isActive = highlightTarget === activeTab;
    const activeColor = "rgba(240, 240, 240, 0.9)";
    const hoverColor = "rgba(208, 208, 208, 0.1)";

    gsap.killTweensOf(marker);
    gsap.to(marker, {
      x,
      width,
      opacity: 1,
      backgroundColor: isActive ? activeColor : hoverColor,
      duration: 0.3,
      ease: "back.out(1.2)",
    });
  }, [highlightTarget, activeTab]);

  const animateNavMarker = useCallback(() => {
    const marker = navMarkerRef.current;
    const container = navContainerRef.current;
    if (!marker || !container) return;

    const targetId = highlightNavTarget;
    if (!targetId) {
      gsap.to(marker, { opacity: 0, duration: 0.25, ease: "power2.out" });
      return;
    }

    const targetEl = navTabRefs.current[targetId];
    if (!targetEl) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const x = targetRect.left - containerRect.left;
    const width = targetRect.width;

    const isActive = highlightNavTarget === activeNavTab;
    const activeColor = "rgba(240, 240, 240, 0.9)";
    const hoverColor = "rgba(208, 208, 208, 0.1)";

    gsap.killTweensOf(marker);
    gsap.to(marker, {
      x,
      width,
      opacity: 1,
      backgroundColor: isActive ? activeColor : hoverColor,
      duration: 0.3,
      ease: "back.out(1.2)",
    });
  }, [highlightNavTarget, activeNavTab]);

  useLayoutEffect(() => {
    animateMarker();
  }, [animateMarker]);

  useLayoutEffect(() => {
    animateNavMarker();
  }, [animateNavMarker]);

  useLayoutEffect(() => {
    const handleResize = () => {
      animateMarker();
      animateNavMarker();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [animateMarker, animateNavMarker]);

  return (
    <main>
      <img
        src="/images/curriculum.png"
        alt="curriculum"
        className="webImage"
      ></img>
      <nav>
        <div>
          <svg
            className="logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
            viewBox="0 0 205 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M27.9863 3.5802C27.9863 1.67141 29.5337 0.124023 31.4425 0.124023V27.7309H27.9863V3.5802Z" fill="#E1E1E1"/>
            <path d="M0 7.03626C0 5.12746 1.54738 3.58008 3.45618 3.58008V27.7733H0V7.03626Z" fill="#E1E1E1"/>
            <path d="M17.2802 0.124023C19.1889 0.124023 20.7363 1.67141 20.7363 3.5802L3.45544 3.5802C3.45544 1.67141 5.00282 0.124023 6.91162 0.124023L17.2802 0.124023Z" fill="#E1E1E1"/>
            <path d="M20.7363 13.9492C20.7363 15.858 19.1889 17.4054 17.2802 17.4054L10.3678 17.4054L10.3678 13.9492L20.7363 13.9492Z" fill="#E1E1E1"/>
            <path d="M24.1924 10.493C24.1924 12.4018 22.645 13.9492 20.7362 13.9492L20.7362 3.58069C22.645 3.58069 24.1924 5.12807 24.1924 7.03686L24.1924 10.493Z" fill="#E1E1E1"/>
            <path d="M38.6934 13.9521H42.1495V24.3207C40.2407 24.3207 38.6934 22.7733 38.6934 20.8645V13.9521Z" fill="#E1E1E1"/>
            <path d="M52.5186 13.9521H55.9747V20.8645C55.9747 22.7733 54.4273 24.3207 52.5186 24.3207V13.9521Z" fill="#E1E1E1"/>
            <path d="M52.5186 24.3115C52.5186 26.2203 50.9712 27.7677 49.0624 27.7677L45.6062 27.7677C43.6974 27.7677 42.15 26.2203 42.15 24.3115L52.5186 24.3115Z" fill="#E1E1E1"/>
            <path d="M59.4307 10.496C59.4307 12.4048 57.8833 13.9521 55.9745 13.9521L55.9745 0.12744L59.4307 0.12744L59.4307 10.496Z" fill="#E1E1E1"/>
            <path d="M38.6934 13.9521C36.7846 13.9521 35.2372 12.4048 35.2372 10.496L35.2372 0.12744L38.6934 0.12744L38.6934 13.9521Z" fill="#E1E1E1"/>
            <path d="M95.8485 0.124023C97.7573 0.124023 99.3047 1.67141 99.3047 3.5802L88.9362 3.5802L88.9362 0.124023L95.8485 0.124023Z" fill="#E1E1E1"/>
            <path d="M113.129 0.124023L113.129 3.5802L102.76 3.5802C102.76 1.67141 104.308 0.124023 106.217 0.124023L113.129 0.124023Z" fill="#E1E1E1"/>
            <rect x="102.76" y="27.7737" width="3.45618" height="24.1932" transform="rotate(-180 102.76 27.7737)" fill="#E1E1E1"/>
            <path d="M75.9121 0.157959H81.0957C83.9588 0.157959 86.2801 2.4785 86.2803 5.34155V20.863H86.2793V22.5906C86.2793 25.4536 83.9587 27.775 81.0957 27.7751H75.9111V27.7537H72.4561V27.7742H67.2725C64.4094 27.7742 62.0881 25.4536 62.0879 22.5906V17.406H65.5439V20.8621C65.5439 22.7112 66.9961 24.2207 68.8223 24.3132L69 24.3181V24.2976H79.3682V24.3181C81.2766 24.3177 82.8231 22.7715 82.8232 20.863V17.407H82.8242V7.07007C82.8242 5.16128 81.277 3.61402 79.3682 3.61401H75.9121V3.58081H67.2715C66.7478 3.58081 66.2421 3.65907 65.7656 3.80347C66.4108 1.67471 68.3881 0.124756 70.7275 0.124756H75.9121V0.157959ZM65.7656 3.80347C65.6212 4.27998 65.543 4.78566 65.543 5.30933V17.405H62.0869V8.76538C62.0869 6.42594 63.6369 4.44866 65.7656 3.80347Z" fill="#E1E1E1"/>
            <path d="M146.364 0.0439453H149.82V24.1947C149.82 26.1034 148.273 27.6508 146.364 27.6508V0.0439453Z" fill="#E1E1E1"/>
            <path d="M153.553 6.95593C153.553 5.04714 155.1 3.49976 157.009 3.49976V27.693H153.553V6.95593Z" fill="#E1E1E1"/>
            <path d="M177.746 6.95593C177.746 5.04714 176.199 3.49976 174.29 3.49976V27.693H177.746V6.95593Z" fill="#E1E1E1"/>
            <path d="M167.377 3.49976H163.921V27.693H167.377V3.49976Z" fill="#E1E1E1"/>
            <path d="M163.92 0.0437012L163.92 3.49988L157.008 3.49988C157.008 1.59108 158.555 0.0437009 160.464 0.043701L163.92 0.0437012Z" fill="#E1E1E1"/>
            <path d="M167.377 0.0437012L167.377 3.49988L174.289 3.49988C174.289 1.59108 172.742 0.0437009 170.833 0.043701L167.377 0.0437012Z" fill="#E1E1E1"/>
            <path d="M180.401 6.95593C180.401 5.04714 181.949 3.49976 183.858 3.49976V10.4121H180.401V6.95593Z" fill="#E1E1E1"/>
            <path d="M180.401 20.7799C180.401 22.6887 181.949 24.2361 183.858 24.2361V13.8676H180.401V20.7799Z" fill="#E1E1E1"/>
            <path d="M197.682 0.043701C199.59 0.0437011 201.138 1.59108 201.138 3.49988L183.857 3.49988C183.857 1.59108 185.404 0.0437005 187.313 0.0437006L197.682 0.043701Z" fill="#E1E1E1"/>
            <path d="M197.682 27.6934C199.59 27.6934 201.138 26.146 201.138 24.2372L183.857 24.2372C183.857 26.146 185.404 27.6934 187.313 27.6934L197.682 27.6934Z" fill="#E1E1E1"/>
            <path d="M201.138 10.4109L201.138 13.8671L183.857 13.8671L183.857 10.4109L201.138 10.4109Z" fill="#E1E1E1"/>
            <path d="M204.595 6.95581L201.139 6.95581L201.139 3.49963C203.047 3.49963 204.595 5.04702 204.595 6.95581Z" fill="#E1E1E1"/>
            <path d="M204.595 17.324L201.139 17.324L201.139 24.2363C203.047 24.2363 204.595 22.6889 204.595 20.7802L204.595 17.324Z" fill="#E1E1E1"/>
            <path d="M142.631 0.000732422L142.631 3.45691L132.262 3.45691C132.262 1.54812 133.81 0.000732036 135.719 0.00073212L142.631 0.000732422Z" fill="#E1E1E1"/>
            <rect x="132.263" y="27.6504" width="3.45618" height="24.1932" transform="rotate(-180 132.263 27.6504)" fill="#E1E1E1"/>
            <path d="M125.351 -1.51074e-07C127.26 -6.76383e-08 128.808 1.54738 128.808 3.45618L118.439 3.45618L118.439 -4.53223e-07L125.351 -1.51074e-07Z" fill="#E1E1E1"/>
          </svg>
        </div>
          <div
            className="Tab_Switcher"
            role="tablist"
            aria-label="Pivot actions"
            ref={containerRef}
          >
            <div className="Tab_Switcher-marker-mask">
              <span
                className="Tab_Switcher-marker"
                ref={markerRef}
                aria-hidden="true"
              />
            </div>
            {TAB_ITEMS.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isHovered = hoveredTab === tab.id;
              const isDimmed =
                activeTab !== "none" && activeTab !== tab.id && !isHovered;
              const classNames = [
                "tab_btn",
                isActive ? "is-active" : "",
                isHovered && !isActive ? "is-hovered" : "",
                isDimmed ? "is-dimmed" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <Fragment key={tab.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={classNames}
                    ref={(node) => {
                      if (node) tabRefs.current[tab.id] = node;
                      else delete tabRefs.current[tab.id];
                    }}
                    onClick={() => handleTabToggle(tab.id)}
                    onMouseEnter={() => setHoveredTab(tab.id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    onFocus={() => setHoveredTab(tab.id)}
                    onBlur={() => setHoveredTab(null)}
                  >
                    {tab.label}
                  </button>
                  {index < TAB_ITEMS.length - 1 && (
                    <span className="line" aria-hidden="true">
                      <svg
                        width="0.1vw"
                        height="1.24vw"
                        viewBox="0 0 1 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.2"
                          d="M0.5 0V22.584"
                          stroke="white"
                        />
                      </svg>
                    </span>
                  )}
                </Fragment>
              );
            })}
          </div>
          <div className="toggle-nav">
            <div
              className={`toggle_btn ${isToggled ? "is-active" : ""}`}
              onClick={handleToggle}
            ></div>
            <div className="nav" ref={navContainerRef}>
              <div className="nav-marker-mask">
                <span className="nav-marker" ref={navMarkerRef} />
              </div>
              {NAV_ITEMS.map((item) => {
                if (item.type === "separator") {
                  return (
                    <span key={item.id} className="line" aria-hidden="true">
                      {item.content}
                    </span>
                  );
                }
                const isActive = activeNavTab === item.id;
                const isHovered = hoveredNavTab === item.id;
                const isDimmed =
                  activeNavTab !== null && activeNavTab !== item.id && !isHovered;
                const classNames = [
                  "nav_btn",
                  item.id === "hamburger" ? "nav_btn--icon" : "",
                  isActive ? "is-active" : "",
                  isHovered && !isActive ? "is-hovered" : "",
                  isDimmed ? "is-dimmed" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={classNames}
                    ref={(node) => {
                      if (node) navTabRefs.current[item.id] = node;
                      else delete navTabRefs.current[item.id];
                    }}
                    onClick={() => handleNavTabToggle(item.id)}
                    onMouseEnter={() => setHoveredNavTab(item.id)}
                    onMouseLeave={() => setHoveredNavTab(null)}
                    onFocus={() => setHoveredNavTab(item.id)}
                    onBlur={() => setHoveredNavTab(null)}
                  >
                    {item.content}
                  </button>
                );
              })}
            </div>
          </div>
      </nav>
    </main>
  );
}