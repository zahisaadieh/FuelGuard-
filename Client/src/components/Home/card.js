import React from 'react';

const Card = (props) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-center mt-4">
        <a href="#">
          <img 
            className="card-img rounded-t-lg" 
            src={props.img} 
            alt="Image" 
            style={{ width: '280px', height: '280px', objectFit: 'cover' }}
          />
        </a>
      </div>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {props.title}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {props.description}
        </p>
        <a
          href={props.link}
        >
        </a>
      </div>
    </div>
  );
};

export default Card;
