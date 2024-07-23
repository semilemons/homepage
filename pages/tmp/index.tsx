// pages/index.tsx
import React from 'react';
import Page from './Page';
import D3Chart from './D3Chart';
import * as d3 from 'd3';

const Home = () => {
  const lanes = [
    { id: "user", name: "ユーザー/クリエイター" },
    { id: "support", name: "カスタマーサポート・運用部" },
    { id: "content", name: "コンテンツ戦略部" },
    { id: "marketing", name: "マーケティング・広報部" },
    { id: "sales", name: "物販戦略部" },
    { id: "system", name: "システム開発部" },
    { id: "legal", name: "法務・コンプライアンス部" }
  ];

  const nodes = [
    // ユーザー/クリエイターレーン
    { id: "user1", name: "サービス利用\nコンテンツ投稿", lane: "user", x: 100, y: 50 },
    { id: "user2", name: "フィードバック\n問い合わせ", lane: "user", x: 300, y: 50 },
    { id: "user3", name: "プレミアム会員登録\n物販利用", lane: "user", x: 500, y: 50 },

    // カスタマーサポート・運用部レーン
    { id: "support1", name: "問い合わせ対応", lane: "support", x: 100, y: 150 },
    { id: "support2", name: "コンテンツモデレーション", lane: "support", x: 300, y: 150 },
    { id: "support3", name: "ユーザーフィードバック分析", lane: "support", x: 500, y: 150 },

    // コンテンツ戦略部レーン
    { id: "content1", name: "コンテンツ戦略立案", lane: "content", x: 100, y: 250 },
    { id: "content2", name: "AI支援ツール企画", lane: "content", x: 300, y: 250 },
    { id: "content3", name: "プロンプト辞書更新", lane: "content", x: 500, y: 250 },

    // マーケティング・広報部レーン
    { id: "marketing1", name: "プロモーション計画", lane: "marketing", x: 100, y: 350 },
    { id: "marketing2", name: "ユーザー獲得施策", lane: "marketing", x: 300, y: 350 },
    { id: "marketing3", name: "ブランディング", lane: "marketing", x: 500, y: 350 },

    // 物販戦略部レーン
    { id: "sales1", name: "商品企画", lane: "sales", x: 100, y: 450 },
    { id: "sales2", name: "在庫管理", lane: "sales", x: 300, y: 450 },
    { id: "sales3", name: "販売分析", lane: "sales", x: 500, y: 450 },

    // システム開発部レーン
    { id: "system1", name: "プラットフォーム開発", lane: "system", x: 100, y: 550 },
    { id: "system2", name: "AI技術実装", lane: "system", x: 300, y: 550 },
    { id: "system3", name: "UI/UX設計と改善", lane: "system", x: 500, y: 550 },

    // 法務・コンプライアンス部レーン
    { id: "legal1", name: "ガイドライン策定", lane: "legal", x: 100, y: 650 },
    { id: "legal2", name: "著作権管理", lane: "legal", x: 300, y: 650 },
    { id: "legal3", name: "法的リスク評価", lane: "legal", x: 500, y: 650 }
  ];

  const links = [
    // ユーザーからの流れ
    { source: "user1", target: "support1" },
    { source: "user2", target: "support1" },
    { source: "user3", target: "sales1" },

    // 部門間の連携
    { source: "support1", target: "content1" },
    { source: "support2", target: "legal2" },
    { source: "support3", target: "content1" },
    { source: "content1", target: "system1" },
    { source: "content2", target: "system2" },
    { source: "content3", target: "marketing1" },
    { source: "marketing1", target: "sales1" },
    { source: "marketing2", target: "content1" },
    { source: "sales1", target: "system3" },
    { source: "sales3", target: "content1" },
    { source: "system1", target: "legal1" },
    { source: "system3", target: "marketing3" },
    { source: "legal1", target: "content1" },

    // フィードバックループ
    { source: "support3", target: "marketing2" },
    { source: "content1", target: "support1" },
    { source: "marketing3", target: "content1" },
    { source: "sales3", target: "marketing1" }
  ];










  





  const renderSwimlaneChart = (svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>, props: any) => {
    const { width, height } = props;
    const laneHeight = height / lanes.length;
    const gap = 32; // 2rem

    // レーンの描画
    svg.selectAll('rect.lane')
      .data(lanes)
      .join('rect')
      .attr('class', 'lane')
      .attr('x', 0)
      .attr('y', (d, i) => i * laneHeight)
      .attr('width', width)
      .attr('height', laneHeight)
      .attr('fill', (d, i) => i % 2 === 0 ? '#f0f0f0' : '#e0e0e0');

    // レーン名の描画
    svg.selectAll('text.lane-name')
      .data(lanes)
      .join('text')
      .attr('class', 'lane-name')
      .attr('x', 10)
      .attr('y', (d, i) => i * laneHeight + 20)
      .text(d => d.name)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold');

    // ノードの描画
    const node = svg.selectAll('g.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('rect')
      .attr('width', 120)
      .attr('height', 60)
      .attr('fill', 'white')
      .attr('stroke', 'black');

    node.append('text')
      .attr('x', 60)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '12px')
      .text(d => d.name)
      .call(wrap, 110);

    // リンクの描画
    svg.selectAll('path.link')
      .data(links)
      .join('path')
      .attr('class', 'link')
      .attr('d', d => {
        const sourceNode = nodes.find(n => n.id === d.source);
        const targetNode = nodes.find(n => n.id === d.target);
        if (sourceNode && targetNode) {
          return `M${sourceNode.x + 60},${sourceNode.y + 30} L${targetNode.x + 60},${targetNode.y + 30}`;
        }
        return '';
      })
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('marker-end', 'url(#arrow)');

    // 矢印マーカーの定義
    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'black');

    // テキストを折り返す関数
    function wrap(text: d3.Selection<SVGTextElement, any, SVGGElement, unknown>, width: number) {
      text.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line: string[] = [];
        let lineNumber = 0;
        const lineHeight = 1.1; // ems
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy") || "0");
        let tspan = text.text(null).append("tspan").attr("x", 60).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node()?.getComputedTextLength()! > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 60).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }
  };

  return (
    <Page title="Step(仮称)プロジェクト 業務フロー図">
      <D3Chart
        width={1000}
        height={900}
        renderChart={renderSwimlaneChart}
      />
    </Page>
  );
};

export default Home;