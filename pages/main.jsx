"use client";

import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { gsap } from "gsap";

import "../styles/main.scss";

import Nav from "../components/nav";

import { GETFEVER, GOPIVOT, GETFEVER2, PIVOTTIME } from "../components/svgCode";

export default function Main() {
  // 그리드 셀 배열
  const rows = 14;
  const cols = 14;

  const gridCells = Array.from({ length: rows * cols }, (_, i) => (
    <div key={i} className="grid-cell" />
  ));

  return (
    <div>
      <img className="webImage" src="/images/main.png" alt="main.png" />

      <Nav />

      <main>
        <div className="hero">
          <div className="grid">
            {gridCells}
          </div>
          <div className="hero-text">
            <div className="gF-gP">
              <div className="gf">
                <GETFEVER />
              </div>

              <div className="gp">
                <GOPIVOT />
              </div>
            </div>

            <div className="main-logo">
              <svg
                className="pivot"
                viewBox="0 0 672 165"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M166.029 20.5035C166.029 9.17975 175.209 0 186.533 0V163.776H166.029V20.5035Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M0 41.0067C0 29.6829 9.17974 20.5032 20.5035 20.5032V164.028H0V41.0067Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M102.514 -8.96239e-07C113.838 -4.0126e-07 123.018 9.17974 123.018 20.5035L20.4999 20.5035C20.4999 9.17974 29.6797 -4.07993e-06 41.0034 -3.58495e-06L102.514 -8.96239e-07Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M123.018 82.0173C123.018 93.3411 113.838 102.521 102.514 102.521L61.507 102.521L61.507 82.0173L123.018 82.0173Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M143.523 61.5138C143.523 72.8376 134.344 82.0173 123.02 82.0173L123.02 20.5067C134.344 20.5067 143.523 29.6865 143.523 41.0103L143.523 61.5138Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M229.545 82.0349H250.048V143.546C238.725 143.546 229.545 134.366 229.545 123.042V82.0349Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M311.561 82.0349H332.064V123.042C332.064 134.366 322.884 143.546 311.561 143.546V82.0349Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M311.561 143.491C311.561 154.815 302.381 163.994 291.057 163.994L270.553 163.994C259.23 163.994 250.05 154.815 250.05 143.491L311.561 143.491Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M352.57 61.5314C352.57 72.8552 343.391 82.0349 332.067 82.0349L332.067 0.0207788L352.57 0.0207806L352.57 61.5314Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M229.545 82.0349C218.221 82.0349 209.041 72.8552 209.041 61.5314L209.041 0.0207788L229.545 0.0207806L229.545 82.0349Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M568.614 -8.96238e-07C579.937 -4.01259e-07 589.117 9.17974 589.117 20.5035L527.607 20.5035L527.607 -2.68871e-06L568.614 -8.96238e-07Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M671.129 0L671.129 20.5035L609.618 20.5035C609.618 9.17974 618.798 -2.28745e-06 630.122 -1.79248e-06L671.129 0Z"
                  fill="#E1E1E1"
                />

                <rect
                  x="609.615"
                  y="164.03"
                  width="20.5035"
                  height="143.525"
                  transform="rotate(-180 609.615 164.03)"
                  fill="#E1E1E1"
                />

                <path
                  d="M481.095 0.198486C498.08 0.198706 511.849 13.969 511.85 30.9543V61.7092H511.848V133.283C511.847 150.269 498.077 164.038 481.092 164.038H450.337V163.912H429.839V164.035H399.083C382.098 164.035 368.328 150.265 368.328 133.28V102.525H388.832V123.029C388.832 134.35 398.009 143.527 409.33 143.531V143.408H470.841V143.535L471.37 143.529C482.449 143.247 491.344 134.179 491.344 123.032V102.529H450.337V102.528H491.344V41.0159C491.242 29.7797 482.103 20.7024 470.843 20.7024H450.339V0.198486H481.095ZM390.146 21.8254C389.289 24.6526 388.828 27.6521 388.828 30.759V102.521H368.324V51.2629C368.324 37.3844 377.517 25.6531 390.146 21.8254ZM450.338 20.5081H399.079C395.972 20.5081 392.973 20.9686 390.146 21.8254C393.973 9.19686 405.705 0.00416884 419.583 0.00415039H450.338V20.5081Z"
                  fill="#E1E1E1"
                />
              </svg>

              <svg
                className="time"
                viewBox="0 0 550 165"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M165.66 0.367676H186.164V143.64C186.164 154.964 176.984 164.144 165.66 164.144V0.367676Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M208.309 41.3719C208.309 30.0481 217.488 20.8684 228.812 20.8684V164.393H208.309V41.3719Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M351.831 41.3719C351.831 30.0481 342.651 20.8684 331.328 20.8684V164.393H351.831V41.3719Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M290.318 20.8684H269.815V164.393H290.318V20.8684Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M269.814 0.365967L269.814 20.8695L228.807 20.8695C228.807 9.54571 237.987 0.365965 249.311 0.365966L269.814 0.365967Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M290.318 0.365967L290.318 20.8695L331.325 20.8695C331.325 9.54571 322.146 0.365965 310.822 0.365966L290.318 0.365967Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M367.588 41.3719C367.588 30.0481 376.768 20.8684 388.091 20.8684V61.8755H367.588V41.3719Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M367.588 123.382C367.588 134.706 376.768 143.885 388.091 143.885V82.3749H367.588V123.382Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M470.102 0.365966C481.426 0.365966 490.605 9.54571 490.605 20.8695L388.088 20.8695C388.088 9.54571 397.268 0.365963 408.591 0.365963L470.102 0.365966Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M470.102 164.395C481.426 164.395 490.605 155.216 490.605 143.892L388.088 143.892C388.088 155.216 397.268 164.395 408.591 164.395L470.102 164.395Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M490.605 61.8682L490.605 82.3717L388.088 82.3717L388.088 61.8682L490.605 61.8682Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M511.11 41.3716L490.607 41.3716L490.607 20.868C501.931 20.868 511.11 30.0478 511.11 41.3716Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M511.11 102.88L490.607 102.88L490.607 143.887C501.931 143.887 511.11 134.707 511.11 123.383L511.11 102.88Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M143.516 0.11084L143.516 20.6144L82.005 20.6144C82.005 9.29058 91.1848 0.110838 102.509 0.110838L143.516 0.11084Z"
                  fill="#E1E1E1"
                />

                <rect
                  x="82.0059"
                  y="164.141"
                  width="20.5035"
                  height="143.525"
                  transform="rotate(-180 82.0059 164.141)"
                  fill="#E1E1E1"
                />

                <path
                  d="M41.0082 0.106689C52.332 0.106689 61.5117 9.28643 61.5117 20.6102L0.00111204 20.6102L0.00111294 0.106687L41.0082 0.106689Z"
                  fill="#E1E1E1"
                />

                <path
                  d="M549.609 0V102.982H549.64H528.903H528.976V0H528.903H549.64"
                  fill="#E1E1E1"
                />

                <path
                  d="M549.464 144.27C549.464 155.629 540.258 164.839 528.903 164.839L528.976 164.912V123.638H528.903H549.64H549.609V144.28H549.464V144.27Z"
                  fill="#E1E1E1"
                />
              </svg>
            </div>

            <div className="infoBox">
              <div className="left">
                <div className="title">
                  Kaywon University of Arts & Design
                  <br />
                  32nd Delight Insight
                </div>

                <div className="link">
                  Digital-media.kr
                  <br />
                  degreeshow/2025
                </div>
              </div>

              <div className="location">
                Kaywon Design Hall 5F
                <br />
                Nov. 22. FRI - Nov. 24. SUN
              </div>
            </div>
          </div>
        </div>

        <div className="keywords">
          <div className="delight">2025 DELIGHT INSIGHT</div>

          <div className="graphics">
            <svg
              className="circle"
              viewBox="0 0 386 337"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="228.701"
                cy="179.91"
                r="156.377"
                stroke="url(#paint0_linear_417_550)"
              />

              <circle
                cx="156.877"
                cy="156.877"
                r="156.377"
                stroke="url(#paint1_linear_417_550)"
              />

              <defs>
                <linearGradient
                  id="paint0_linear_417_550"
                  x1="228.701"
                  y1="23.033"
                  x2="228.701"
                  y2="336.788"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#A4A4A4" stopOpacity="0.6" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
                </linearGradient>

                <linearGradient
                  id="paint1_linear_417_550"
                  x1="156.877"
                  y1="0"
                  x2="156.877"
                  y2="313.755"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#A4A4A4" stopOpacity="0.6" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>

            <svg
              className="line"
              viewBox="0 0 927 459"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M300.41 441.213L604.699 22.8159"
                stroke="url(#paint0_linear_417_550)"
              />

              <path
                d="M627.736 423.757L270.195 49.8425"
                stroke="url(#paint1_linear_417_550)"
              />

              <path
                d="M0.22168 458.448L926.705 0.44822"
                stroke="url(#paint2_linear_417_550)"
              />

              <defs>
                <linearGradient
                  id="paint0_linear_417_550"
                  x1="452.554"
                  y1="22.8159"
                  x2="452.554"
                  y2="441.213"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7B7B7B" stopOpacity="0.5" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#7B7B7B" stopOpacity="0.5" />
                </linearGradient>

                <linearGradient
                  id="paint1_linear_417_550"
                  x1="243.109"
                  y1="199.556"
                  x2="654.822"
                  y2="274.043"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7B7B7B" stopOpacity="0.5" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#7B7B7B" stopOpacity="0.5" />
                </linearGradient>

                <linearGradient
                  id="paint2_linear_417_550"
                  x1="463.463"
                  y1="0.447998"
                  x2="463.463"
                  y2="458.448"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7B7B7B" stopOpacity="0.5" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#7B7B7B" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>

            <svg
              className="rectangle"
              width="351"
              height="330"
              viewBox="0 0 351 330"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="66.5175"
                y="45.498"
                width="283.787"
                height="283.787"
                stroke="url(#paint0_linear_417_550)"
              />

              <rect
                x="0.5"
                y="0.5"
                width="283.787"
                height="283.787"
                stroke="url(#paint1_linear_417_550)"
              />

              <defs>
                <linearGradient
                  id="paint0_linear_417_550"
                  x1="208.411"
                  y1="44.998"
                  x2="208.411"
                  y2="329.785"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#A4A4A4" stopOpacity="0.6" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
                </linearGradient>

                <linearGradient
                  id="paint1_linear_417_550"
                  x1="142.394"
                  y1="0"
                  x2="142.394"
                  y2="284.787"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#A4A4A4" stopOpacity="0.6" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="txt">
            <div className="logo">
              <PIVOTTIME />
            </div>

            <p>
              DELIGHT INSIGHT는 계원예술대학교 디지털미디어디자인과 졸업 전시의
              대주제입니다.
              <br />
              이번 주제는 한 지점을 중심으로 방향을 바꾸거나 모색한다는 의미의
              PIVOT을 활용해,
              <br />
              우리가 쌓아온 경험과 배움을 토대로 더 넓은 가능성을 향해 움직이는
              순간을 그립니다.
            </p>
          </div>
        </div>

        <div className="video">
          <p>Video Section</p>
        </div>

        <div className="concept">
          <div className="graphic">
            <svg
              viewBox="0 0 1922 743"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M948.744 133.111L1337.06 611.289"
                stroke="url(#paint0_linear_417_550)"
              />

              <path
                d="M1425.81 242.838L559.578 470.909"
                stroke="url(#paint1_linear_417_550)"
              />

              <path
                d="M1291.51 61.1069L885.349 640.15"
                stroke="url(#paint2_linear_417_550)"
              />

              <path
                d="M-2.80762 0.479553L2000.44 591.182"
                stroke="url(#paint3_linear_417_550)"
              />

              <path
                d="M-36.0611 172.679L2033.69 452.049"
                stroke="url(#paint4_linear_417_550)"
              />

              <path
                d="M1924.34 20.8268L-2.80841 742.238"
                stroke="url(#paint5_linear_417_550)"
              />

              <path
                d="M-1.53978 483.028L2002.79 201.034"
                stroke="url(#paint6_linear_417_550)"
              />

              <defs>
                <linearGradient
                  id="paint0_linear_417_550"
                  x1="1142.9"
                  y1="133.111"
                  x2="1142.9"
                  y2="611.289"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7B7B7B" stopOpacity="0.5" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#7B7B7B" stopOpacity="0.5" />
                </linearGradient>

                <linearGradient
                  id="paint1_linear_417_550"
                  x1="992.694"
                  y1="242.838"
                  x2="992.694"
                  y2="470.909"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7B7B7B" stopOpacity="0.5" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#7B7B7B" stopOpacity="0.5" />
                </linearGradient>

                <linearGradient
                  id="paint2_linear_417_550"
                  x1="1088.43"
                  y1="61.1069"
                  x2="1088.43"
                  y2="640.15"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7B7B7B" stopOpacity="0.5" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#7B7B7B" stopOpacity="0.5" />
                </linearGradient>

                <linearGradient
                  id="paint3_linear_417_550"
                  x1="998.815"
                  y1="591.182"
                  x2="998.815"
                  y2="0.479553"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7B7B7B" stopOpacity="0.5" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#7B7B7B" stopOpacity="0.5" />
                </linearGradient>

                <linearGradient
                  id="paint4_linear_417_550"
                  x1="1043.7"
                  y1="604.284"
                  x2="953.925"
                  y2="20.4439"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7B7B7B" stopOpacity="0.5" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#7B7B7B" stopOpacity="0.5" />
                </linearGradient>

                <linearGradient
                  id="paint5_linear_417_550"
                  x1="915.919"
                  y1="833.412"
                  x2="1005.61"
                  y2="-70.347"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7B7B7B" stopOpacity="0.5" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#7B7B7B" stopOpacity="0.5" />
                </linearGradient>

                <linearGradient
                  id="paint6_linear_417_550"
                  x1="996.473"
                  y1="299.668"
                  x2="1004.78"
                  y2="384.395"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7B7B7B" stopOpacity="0.5" />

                  <stop offset="0.471154" stopColor="#E1E1E1" />

                  <stop offset="1" stopColor="#7B7B7B" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>

            <div className="txt">
              <div></div>

              <p>생각을 잇고, 방향을 만드는 시작의 선</p>
            </div>
          </div>

          <div className="txt-wrap">
            <div className="logo">
              <GETFEVER />
            </div>

            <div className="description">
              <div className="title">
                <div>기획</div>

                <p>사고의 궤적</p>
              </div>

              <p>
                아이디어의 출발점과 도착점을 잇는 선은 방향을 제시하고, 흐름을
                만듭니다.
                <br />
                선들이 모여 스토리라인이 되고, 그 안에서 연결과 구조가
                생겨납니다.
                <br />
                플로우차트처럼 서로 이어지는 선 위에서, 기획은 전체를 조율하는
                길을 그립니다.
              </p>
            </div>
          </div>
        </div>

        <div className="visual"></div>

        <div className="typography"></div>

        <div className="highlight"></div>

        <div className="main-footer"></div>
      </main>
    </div>
  );
}
