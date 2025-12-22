import React from "react";

function Loader() {
    return (
        <div className="flex space-x-4">
            <svg height="0" width="0" className="absolute">
                <defs>
                    {/* Main gradient like LMS PNG */}
                    <linearGradient id="lms-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0bc6f2" />   {/* Light blue */}
                        <stop offset="50%" stopColor="#05a997" />  {/* Green */}
                        <stop offset="100%" stopColor="#029c65" /> {/* Deep green */}
                    </linearGradient>

                    {/* Highlight yellow stroke */}
                    <linearGradient id="lms-highlight" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#fff100" />
                        <stop offset="100%" stopColor="#e3e80c" />
                    </linearGradient>
                </defs>
            </svg>

            {/* L */}
            <svg viewBox="0 0 64 64" height="64" width="64" className="inline-block">
                {/* Outer Gradient Stroke */}
                <path
                    d="M16 8 V56 H56"
                    stroke="url(#lms-gradient)"
                    strokeWidth="11.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    className="dash"
                    pathLength="360"
                />
                {/* Inner Highlight Stroke */}
                <path
                    d="M16 8 V56 H56"
                    stroke="url(#lms-highlight)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    className="dash"
                    pathLength="360"
                />
            </svg>

            {/* M */}
            <svg viewBox="0 0 64 64" height="64" width="64" className="inline-block">
                <path
                    d="M8 56 V8 L32 40 L56 8 V56"
                    stroke="url(#lms-gradient)"
                    strokeWidth="11.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    className="dash"
                    pathLength="360"
                />
                <path
                    d="M8 56 V8 L32 40 L56 8 V56"
                    stroke="url(#lms-highlight)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    className="dash"
                    pathLength="360"
                />
            </svg>

            {/* S */}
            <svg viewBox="0 0 84 64" height="64" width="84" className="inline-block">
                <path
                    d="M52 12 H20 C8 12, 8 28, 20 28 H44 C56 28, 56 44, 44 44 H12"
                    stroke="url(#lms-gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    className="dash"
                    pathLength="360"
                    transform="scale(1.4) translate(-6,-6)"
                />
                <path
                    d="M52 12 H20 C8 12, 8 28, 20 28 H44 C56 28, 56 44, 44 44 H12"
                    stroke="url(#lms-highlight)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    className="dash"
                    pathLength="360"
                    transform="scale(1.4) translate(-6,-6)"
                />
            </svg>
        </div>
    );
}

export default Loader;
