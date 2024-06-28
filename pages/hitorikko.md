# プロジェクト設計書：semilemon/homepage

## 1. はじめに

このドキュメントは、semilemon/homepage プロジェクトの設計概要を提供します。プロジェクトの詳細な背景、決定事項、およびコンポーネントの実装に関する具体的な情報は、以下のURL内の会話に記録されています：

[プロジェクト詳細会話URL](https://claude.ai/chat/975ec957-2f3c-4c30-bb05-6c19e3a7c934)

**注意**: 上記URLには、プロジェクトに関する重要な決定事項や実装の詳細が含まれています。このドキュメントと合わせて参照することを強く推奨します。

## 2. プロジェクト概要

semilemon/homepage は、最新のWeb技術を活用した動的なホームページプロジェクトです。Next.jsフレームワークを基盤とし、shadcn/uiコンポーネントライブラリを使用して、モダンでインタラクティブなユーザーインターフェースを実現しています。

## 3. 技術スタック

- フレームワーク: Next.js
- スタイリング: Tailwind CSS
- UIコンポーネント: shadcn/ui
- 言語: TypeScript

## 4. 主要コンポーネント

プロジェクトには以下の主要なshadcn/uiコンポーネントが含まれています：

- Button, Input, Textarea, Label
- Card, Separator, Sheet
- DropdownMenu, NavigationMenu, Tabs
- Checkbox, RadioGroup, Select, Switch
- Alert, Toast
- Dialog, Popover, Tooltip
- Table, Avatar, Badge

これらのコンポーネントは `components/ui/` ディレクトリに配置されています。

## 5. プロジェクト構造

```
semilemon/homepage/
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── ...
├── pages/
│   └── claude-chatpractice.tsx
├── styles/
│   └── globals.css
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## 6. 開発ガイドライン

1. コンポーネントの再利用: shadcn/uiコンポーネントを最大限に活用し、一貫性のあるUIを維持します。
2. TypeScriptの活用: 型安全性を確保するため、すべての新しいコンポーネントやfunctionにはTypeScriptを使用します。
3. Tailwind CSSの使用: スタイリングにはTailwind CSSを使用し、カスタムCSSの使用は最小限に抑えます。

## 7. 将来の開発方針

1. パフォーマンス最適化: 必要に応じてコンポーネントの遅延読み込みを実装します。
2. アクセシビリティ: WAI-ARIAガイドラインに従い、アクセシビリティを向上させます。
3. 国際化: 複数言語のサポートを検討します。

## 8. 結論

このプロジェクトはモダンなWeb技術を活用し、拡張性と保守性を重視して設計されています。詳細な実装や決定事項については、上記の会話URLを参照してください。

今後の開発や変更を行う際は、このドキュメントと会話の内容を十分に理解し、プロジェクトの一貫性と品質を維持するようにしてください。