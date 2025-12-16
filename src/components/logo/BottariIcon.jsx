/**
 * @file client/src/components/logo/BottariIcon2.jsx
 * @description 보따리 아이콘 컴포넌트 v2 (홍조 단색)
 * 251215 v1.0.0 N init
 */

import "./BottariIcon.css";

const BottariIcon = ({ width = 70, height = 70, className = "" }) => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 70 70"
      width={width}
      height={height}
      className={className}
    >
      <defs>
        <style>
          {`.bottari-icon-cls-1,.bottari-icon-cls-7{fill:#fbefef;}.bottari-icon-cls-2{fill:#ffd4e6;}.bottari-icon-cls-3,.bottari-icon-cls-6{fill:#60c6fa;}.bottari-icon-cls-10,.bottari-icon-cls-11,.bottari-icon-cls-3,.bottari-icon-cls-4,.bottari-icon-cls-5,.bottari-icon-cls-6,.bottari-icon-cls-7,.bottari-icon-cls-8,.bottari-icon-cls-9{stroke:#26326f;stroke-linecap:round;stroke-width:1.5px;}.bottari-icon-cls-10,.bottari-icon-cls-3,.bottari-icon-cls-8{stroke-miterlimit:10;}.bottari-icon-cls-10,.bottari-icon-cls-4{fill:#ffbec6;}.bottari-icon-cls-11,.bottari-icon-cls-4,.bottari-icon-cls-5,.bottari-icon-cls-6,.bottari-icon-cls-7,.bottari-icon-cls-9{stroke-linejoin:round;}.bottari-icon-cls-5,.bottari-icon-cls-8{fill:#8fe2ff;}.bottari-icon-cls-9{fill:#8be3fa;}.bottari-icon-cls-11{fill:none;}`}
        </style>
      </defs>
      <title>bottari-icon</title>
      <polygon
        className="bottari-icon-cls-1"
        points="28.26 25.54 16.76 29.29 8.05 37.41 8.05 48.15 16.05 56.2 28.6 59.79 43.64 56.84 51.01 45.83 52.86 37.07 45.31 27.01 28.26 25.54"
      />
      {/* 홍조 */}
      <ellipse className="bottari-icon-cls-2" cx="39.39" cy="43.32" rx="3.86" ry="1.71" />
      <ellipse className="bottari-icon-cls-2" cx="19.13" cy="43.32" rx="3.86" ry="1.71" />
      <path className="bottari-icon-cls-3" d="M36.64,22.78A9.75,9.75,0,0,0,42,20.33" />
      <path className="bottari-icon-cls-3" d="M30.59,22.41a16.67,16.67,0,0,1-4.66-3.51" />
      {/* 안쪽 보따리 - 왼 */}
      <path
        className="bottari-icon-cls-4"
        d="M10.34,37.07l-5,2.74-2.3,9.31.76,6.66,4.81,4.61,2.11.27,3.8.32c5.72,2.7,10.08.83,10.08.83a5.29,5.29,0,0,1,2.12-2.94c-.81-.15-12-2.39-15.69-12.11a18,18,0,0,1-.71-9.69"
      />
      {/* 안쪽 보따리 - 오른 */}
      <path
        className="bottari-icon-cls-5"
        d="M49.08,36.32c1.68,4.92-.19,10.52-4.92,15.56S31.59,58.1,31.59,58.1c-7,1.18-6.53,3.73-6.53,3.73a14.44,14.44,0,0,0,11.76,0,22.24,22.24,0,0,0,12.57,0l9.36-3.45,2.3-16.13-12-5.93"
      />
      {/* 바깥 보따리 - 오른 */}
      <path
        className="bottari-icon-cls-4"
        d="M38.06,27.24s8.28,1.55,11,9.08a12.25,12.25,0,0,1,5,9.65s5.61,12.19-4.35,15.74c0,0,7.53,1.12,13.63-3.48s4-13.13,2-17.18c-1.44-2.93-2.27-5.29-2.78-6-4.81-7.19-12.7-9.24-15.22-9.79L35.7,23.81v2.31Z"
      />
      {/* 바깥 보따리 - 왼 */}
      <path
        className="bottari-icon-cls-5"
        d="M29.81,26.86s-9.52-1.06-17,8.22a10.11,10.11,0,0,0-3.14,2.58,9.73,9.73,0,0,0-2.34,5.7,7.33,7.33,0,0,1-.14,1.86,3.07,3.07,0,0,1-.55,1.52,4.5,4.5,0,0,0-.89,1.09A13.07,13.07,0,0,0,5,49.71a10.46,10.46,0,0,0,1.4,7.38,9.85,9.85,0,0,0,4.09,3.63,8.68,8.68,0,0,1-5.31-2.31c-4-3.83-2.77-10.6-2.28-13.19C5.28,32.48,19.68,25.84,22.24,24.7l4.25-.89h2.3Z"
      />
      {/* 눈 */}
      <line className="bottari-icon-cls-6" x1="23.11" y1="38.79" x2="23.11" y2="42.31" />
      <line className="bottari-icon-cls-6" x1="35.63" y1="38.79" x2="35.63" y2="42.31" />
      {/* 입 */}
      <rect className="bottari-icon-cls-7" x="25.93" y="43.46" width="6.86" height="4.68" />
      {/* 오른쪽 귀 */}
      <path
        className="bottari-icon-cls-8"
        d="M36.53,21.05a22,22,0,0,1,4.11-6.79,10.91,10.91,0,0,1,4.49-3.39,5.64,5.64,0,0,1,4.26-.19,14.38,14.38,0,0,0,6.41-.12c2.91-.65,8.59-4.54,9.46-3.74s-.94,5-2.62,7.53a24,24,0,0,1-4,4.42A24.36,24.36,0,0,1,52,23.65a19.9,19.9,0,0,1-5.4,1.67,19.49,19.49,0,0,1-9.31-.89"
      />
      {/* 매듭 */}
      <path
        className="bottari-icon-cls-9"
        d="M36.13,21a11.23,11.23,0,0,1,.69,3.35,3.54,3.54,0,0,0,1,2.55s-4.14,1.39-4.51.78c0,0-3.11.44-3.23-1.22s.37-6.65,3.23-6.34a2.7,2.7,0,0,1,1.32-.68A3,3,0,0,1,37,20Z"
      />
      {/* 왼쪽 귀 */}
      <path
        className="bottari-icon-cls-10"
        d="M30.59,21A16.14,16.14,0,0,0,28,16.47a12.67,12.67,0,0,0-2.79-2.72c-2.34-1.59-3.15-.66-6.48-2a43.21,43.21,0,0,1-6.62-3.33c-1-.73-1.8-1-2.23-.66-.95.66.36,4.06.89,5.42,1.53,4,2.39,6.2,4.66,8.17C19.88,25.16,26.16,25,29.58,25h.14"
      />
      <path className="bottari-icon-cls-11" d="M36.13,21s-4,1.63-2.53,6.33" />
    </svg>
  );
};

export default BottariIcon;
