import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';

const TreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-4">
      <div className="flex items-center py-2">
        {hasChildren && (
          <button onClick={() => setIsOpen(!isOpen)} className="mr-2">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        <span className="font-semibold">{node.title}</span>
        {node.description && (
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="ml-2 text-blue-500 hover:text-blue-700"
          >
            <Info size={16} />
          </button>
        )}
      </div>
      {showInfo && node.description && (
        <div className="ml-6 mt-2 p-2 bg-gray-100 rounded-md text-sm">
          {node.description}
        </div>
      )}
      {isOpen && hasChildren && (
        <div className="ml-4">
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const BuddhismConceptsTree = () => {
  const data = {
    title: "四諦（したい）",
    description: "仏教の基本的な教えである四つの真理。苦しみの原因と解決方法を示す。",
    children: [
      {
        title: "1. 苦諦（くたい）",
        description: "人生には苦しみが存在するという真理。",
        children: [
          { 
            title: "四苦：生・老・病・死",
            description: "人生の四つの基本的な苦しみ。生まれること、年をとること、病気になること、死ぬこと。"
          },
          { 
            title: "八苦：四苦 + 愛別離苦・怨憎会苦・求不得苦・五蘊盛苦",
            description: "四苦に加えて、愛する者と別れる苦しみ、憎む者と会う苦しみ、欲しいものが得られない苦しみ、五蘊（心身の要素）が盛んになる苦しみ。"
          }
        ]
      },
      {
        title: "2. 集諦（じったい）",
        description: "苦しみの原因に関する真理。",
        children: [
          { 
            title: "煩悩（ぼんのう）：三毒（貪・瞋・痴）",
            description: "心を乱す諸々の妄念。特に貪欲（むさぼり）、瞋恚（いかり）、愚痴（無知）の三つを三毒という。"
          },
          { 
            title: "渇愛（かつあい）",
            description: "強い欲望や執着のこと。苦しみの直接的な原因とされる。"
          },
          { 
            title: "無明（むみょう）",
            description: "真理を知らないこと。物事の本質を理解していない状態。"
          },
          { 
            title: "業（ごう）",
            description: "行為とその結果。過去の行為が現在や未来に影響を与えるという考え。"
          }
        ]
      },
      {
        title: "3. 滅諦（めったい）",
        description: "苦しみが滅せられた状態に関する真理。",
        children: [
          { 
            title: "涅槃（ねはん）",
            description: "すべての煩悩や執着が消え去った究極の悟りの状態。"
          }
        ]
      },
      {
        title: "4. 道諦（どうたい）",
        description: "苦しみを滅する方法に関する真理。",
        children: [
          { 
            title: "八正道（はっしょうどう）",
            description: "涅槃に至るための8つの正しい実践方法。",
            children: [
              { title: "1. 正見（しょうけん）", description: "正しい見解を持つこと。" },
              { title: "2. 正思（しょうし）", description: "正しい思考を持つこと。" },
              { title: "3. 正語（しょうご）", description: "正しい言葉を使うこと。" },
              { title: "4. 正業（しょうごう）", description: "正しい行いをすること。" },
              { title: "5. 正命（しょうみょう）", description: "正しい生活をすること。" },
              { title: "6. 正精進（しょうしょうじん）", description: "正しく努力すること。" },
              { title: "7. 正念（しょうねん）", description: "正しい心の在り方を保つこと。" },
              { title: "8. 正定（しょうじょう）", description: "正しい精神統一をすること。" }
            ]
          }
        ]
      }
    ]
  };

  const additionalConcepts = {
    title: "関連する重要概念",
    description: "四諦以外の仏教の重要な教えや概念。",
    children: [
      { 
        title: "縁起説（えんぎせつ）",
        description: "すべての物事は相互に関連し合って生じるという考え方。"
      },
      { 
        title: "三法印（さんぼういん）",
        description: "仏教の根本的な三つの特徴。",
        children: [
          { 
            title: "諸行無常（しょぎょうむじょう）",
            description: "すべての現象は常に変化し、永遠に存在するものはないという考え。"
          },
          { 
            title: "諸法無我（しょほうむが）",
            description: "すべての存在には固定的な実体（我）がないという考え。"
          },
          { 
            title: "涅槃寂静（ねはんじゃくじょう）",
            description: "涅槃の境地は静寂で安らかであるという考え。"
          }
        ]
      },
      { 
        title: "五蘊（ごうん）：色・受・想・行・識",
        description: "人間の存在を構成する五つの要素。色（物質的要素）、受（感覚）、想（認識）、行（意思）、識（意識）。"
      }
    ]
  };


  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">仏教の主要概念</h1>
      <TreeNode node={data} />
      <TreeNode node={additionalConcepts} />


    {/* <Link href="/buddhism/page1">
      <a className="mt-8 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
        Page 1
      </a>
    </Link> */}
    <Link href="/buddhism/page2">
      <a className="mt-8 inline-block bg-green-400 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
        慈悲の瞑想
      </a>
    </Link>
    </div>
  );
};


export default BuddhismConceptsTree;