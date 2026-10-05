// src/design/tokens/motion.js

const motion = {
  durations: {
    fast: "150ms",
    normal: "250ms",
    slow: "400ms",
  },

  easing: {
    standard: "ease",
    smooth: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    sharp: "cubic-bezier(0.4, 0.0, 0.6, 1)",
  },

  effects: {
    neonPulse: `
      0% { box-shadow: 0 0 0px #00FF66; }
      50% { box-shadow: 0 0 12px #00FF66; }
      100% { box-shadow: 0 0 0px #00FF66; }
    `,
    metallicShimmer: `
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    `,
  },
};

export default motion;
