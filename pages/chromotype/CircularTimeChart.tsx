import React from 'react';

const CircularTimeChart = () => {
  const segments = [
    { startAngle: 0, endAngle: 30, color: '#FEF3C7', label: '睡眠' },
    { startAngle: 30, endAngle: 90, color: '#FDE68A', label: '起床・朝の準備' },
    { startAngle: 90, endAngle: 180, color: '#D1FAE5', label: '日中の活動' },
    { startAngle: 180, endAngle: 270, color: '#818CF8', label: '集中タイム' },
    { startAngle: 270, endAngle: 330, color: '#C7D2FE', label: '夜の活動' },
    { startAngle: 330, endAngle: 360, color: '#E0E7FF', label: '就寝準備' },
  ];

  const radius = 150;
  const centerX = 200;
  const centerY = 200;

  const polarToCartesian = (angle) => {
    const radians = (angle - 90) * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians),
    };
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {/* <h2 className="text-2xl font-bold mb-4">オオカミ型の1日のリズム</h2> */}
      <svg width="400" height="450" viewBox="0 0 400 450">
        {segments.map((segment, index) => {
          const start = polarToCartesian(segment.startAngle);
          const end = polarToCartesian(segment.endAngle);
          const largeArcFlag = segment.endAngle - segment.startAngle <= 180 ? "0" : "1";

          return (
            <g key={index}>
              <path
                d={`M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`}
                fill={segment.color}
                stroke="#4B5563"
                strokeWidth="1"
              />
              <text
                x={polarToCartesian((segment.startAngle + segment.endAngle) / 2).x}
                y={polarToCartesian((segment.startAngle + segment.endAngle) / 2).y}
                textAnchor="middle"
                fill="#4B5563"
                fontSize="12"
                dy=".3em"
              >
                {segment.label}
              </text>
            </g>
          );
        })}
        {[0, 6, 12, 18].map((hour) => {
          const pos = polarToCartesian(hour * 15);
          return (
            <text
              key={hour}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              fill="#1F2937"
              fontSize="14"
              fontWeight="bold"
            >
              {hour}:00
            </text>
          );
        })}
      </svg>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          このグラフは、オオカミ型の人々にとって理想的な1日のリズムを表しています。
          <br />夕方から夜にかけての時間帯が最も生産性が高くなります。
        </p>
      </div>
    </div>
  );
};

export default CircularTimeChart;