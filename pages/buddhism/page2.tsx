import React from 'react';
import Link from 'next/link';


const MeditationSection = ({ target }) => (
  <div className="mb-6">
    <p className="mb-2">{target}が幸せでありますように</p>
    <p className="mb-2">{target}の悩み苦しみがなくなりますように</p>
    <p className="mb-2">{target}の願いごとが叶えられますように</p>
    <p className="mb-2">{target}に悟りの光が現れますように</p>
    <p className="mb-2">{target}が幸せでありますように</p>
    <p className="italic text-gray-600">（3回繰り返す）</p>
  </div>
);

const CompassionMeditation = () => {
  return (
    
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">慈悲の瞑想</h2>
      
      <MeditationSection target="私" />
      <MeditationSection target="私の親しい生命" />
      <MeditationSection target="生きとし生けるもの" />
      
      <p className="mt-4 text-sm text-gray-500 text-center">
        この瞑想を行うことで、自己、身近な人々、そしてすべての生き物への慈悲の心を育みます。
      </p>

      <Link href="/buddhism">
      <a className="mt-8 inline-block bg-green-400 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
        Back
      </a>
    </Link>
    </div>
  );
};

export default CompassionMeditation;