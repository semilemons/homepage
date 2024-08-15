import React from 'react';
import CircularTimeChart from './CircularTimeChart';
const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    {children}
  </div>
);

const List = ({ items }) => (
  <ul className="list-disc pl-5">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

const Table = ({ data }) => (
  <table className="w-full border-collapse">
    <tbody>
      {data.map((row, index) => (
        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
          <td className="border px-4 py-2 font-semibold">{row[0]}</td>
          <td className="border px-4 py-2">{row[1]}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const WolfChronotypeApp = () => {
  const characteristics = [
    'クリエイティブ', '枠にとらわれない', '新しいモノ好き', 'リスクを取る',
    '繰り返しが嫌い', '内向的', '気分屋', '控えめ', '刺激を求める',
    '色々気にしがち', '夜が好き', '考えるのが好き'
  ];

  const bestTimes = [
    ['必要睡眠時間', '7～8時間'],
    ['起床', '07:00-07:30'],
    ['就寝', '24:00'],
    ['集中仕事', '17:00-24:00'],
    ['運動', '18:00-20:00'],
    ['コーヒー', '12:00-14:00'],
    ['アルコール', '19:00-21:00']
  ];

  const idealSchedule = [
    ['07:00 - 07:30', '起床'],
    ['07:30 - 08:00', '朝食'],
    ['08:30 - 09:00', '数分の軽い運動'],
    ['09:00 - 09:30', '1日の計画立案'],
    ['10:30 - 11:00', 'コーヒーを飲む'],
    ['11:00 - 13:00', '頭を使わない雑務'],
    ['13:00 - 14:00', '昼食'],
    ['14:00 - 14:30', '軽い散歩'],
    ['15:00 - 18:00', '集中力のいる重要な仕事'],
    ['18:00 - 19:00', '運動'],
    ['20:00 - 21:00', '夕食（飲酒OK）'],
    ['21:00 - 23:00', 'リラックスタイム'],
    ['23:00 - 24:00', 'PC･スマホオフ,シャワー,瞑想など'],
    ['24:00', '就寝']
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">オオカミ型クロノタイプ</h1>
      
      <Section title="オオカミ型のベストな時間帯">
        <Table data={bestTimes} />
      </Section>

      <CircularTimeChart/>


      <Section title="オオカミ型の理想の1日スケジュール">
        <Table data={idealSchedule} />
      </Section>

      <Section title="概要">
        <p>オオカミ型は、夕方から夜にかけて最もパフォーマンスが上がる夜型タイプです。朝に弱く、目覚ましが鳴ってもなかなか起きられません。起きても午前中はエンジンがかからないため、重要な会議やクリエイティブな仕事は避けた方が無難です。日が沈むころには俄然元気になり、高い集中力を発揮できます。</p>
      </Section>

      <Section title="オオカミ型の割合">
        <p>全人口の15-20%</p>
      </Section>

      <Section title="オオカミ型の性格･特徴">
        <List items={characteristics} />
      </Section>
    </div>
  );
};

export default WolfChronotypeApp;