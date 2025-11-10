export default function InfoBox() {
  return (
    <div style={styles.infoBox}>
      <div style={styles.left}>
        <div style={styles.nowrap}>
          Kaywon University of Arts &amp; Design
          <br />
          32nd Delight Insight
        </div>
        <div style={styles.nowrap}>
          Digital-media.kr
          <br />
          degreeshow/2025
        </div>
      </div>
      <div style={{...styles.location, ...styles.nowrap}}>
        Kaywon Design Hall 5F
        <br />
        Nov. 21. FRI - Nov. 23. SUN
      </div>
    </div>
  );
}

const styles = {
  infoBox: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 'clamp(0.75rem, 0.73vw, 1.2rem)',
    fontWeight: 500,
    color: '#fff',
    letterSpacing: '-0.03rem',
    lineHeight: 1.35,
    pointerEvents: 'none',
    width: '93.4vw',
    margin: '0 auto',
    paddingBottom: '4.1vh',
  },
  left: {
    display: 'flex',
    columnGap: '4.1vw',
  },
  location: {
    textAlign: 'right',
  },
  nowrap: {
    whiteSpace: 'nowrap',
  },
};

