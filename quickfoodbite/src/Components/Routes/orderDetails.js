import React from "react";
import { FaCheckCircle } from "react-icons/fa";
export const OrderDetails = () => {
  const quotes = [
    "The key is to have every key, the key to open every door.",
    "We don’t see them, we will never see them.",
    "To be successful you’ve got to work hard.",
    "Some people can’t handle success, I can. I’m giving you cloth talk, cloth.",
    "Special cloth alert, cut from a special cloth.",
  ];
  return (
    <div className="container mt-5">
      <h1 className="text-start mb-4 text-danger">Order Details</h1>
      <div className="bg-light p-4 rounded">
        <p>
          Lorem Khaled Ipsum is a major key to success. Eliptical talk. The key
          to more success is to get a massage once a week, very important, major
          key, cloth talk. Mogul talk. Cloth talk. I’m giving you cloth talk,
          cloth. Special cloth alert, cut from a special cloth. In life you have
          to take the trash out, if you have trash in your life, take it out,
          throw it away, get rid of it, major key. Surround yourself with
          angels. The key to more success is to have a lot of pillows. Life is
          what you make it, so let’s make it.
        </p>
        <div className="bg-light p-4 rounded">
          <ul className="list-unstyled">
            {quotes.map((quote, index) => (
              <li key={index} className="d-flex align-items-center mb-2">
                <FaCheckCircle className="text-success me-2" />
                <span>{quote}</span>
              </li>
            ))}
          </ul>
        </div>
        <p>
          The key is to have every key, the key to open every door. We don’t see
          them, we will never see them. To be successful you’ve got to work
          hard. Some people can’t handle success, I can. I’m giving you cloth
          talk, cloth. Special cloth alert, cut from a special cloth.
        </p>
        <p>
          Lorem Khaled Ipsum is a major key to success. It’s on you how you want
          to live your life. Everyone has a choice. I pick my choice, squeaky
          clean. Always remember in the jungle there’s a lot of they in there,
          after you overcome they, you will make it to paradise. Wraith talk.
          Surround yourself with angels, positive energy, beautiful people,
          beautiful souls, clean heart, angel. They don’t want us to eat. Life
          is what you make it, so let’s make it. The key is to enjoy life,
          because they don’t want you to enjoy life. I promise you, they don’t
          want you to jetski, they don’t want you to smile.
        </p>
        <p>
          Let’s see what Chef Dee got that they don’t want us to eat. The
          weather is amazing, walk with me through the pathway of more success.
          Take this journey with me, Lion! We the best. The key to more success
          is to get a massage once a week, very important, major key, cloth
          talk. The first of the month is coming, we have to get money, we have
          no choice. It cost money to eat and they don’t want you to eat.
        </p>
        <p>
          Another one. It’s important to use cocoa butter. It’s the key to more
          success, why not live smooth? Why live rough? Another one. Give thanks
          to the most high. They don’t want us to win. The ladies always say
          Khaled you smell good, I use no cologne. Cocoa butter is the key.
          Congratulations, you played yourself. In life you have to take the
          trash out, if you have trash in your life, take it out, throw it away,
          get rid of it, major key. You should never complain, complaining is a
          weak emotion, you got life, we breathing, we blessed.
        </p>
        <p>
          The other day the grass was brown, now it’s green because I ain’t give
          up. Never surrender. Cloth talk. Find peace, life is like a waterfall,
          you’ve gotta flow. Mogul talk. The first of the month is coming, we
          have to get money, we have no choice. It cost money to eat and they
          don’t want you to eat. You should never complain, complaining is a
          weak emotion, you got life, we breathing, we blessed. The first of the
          month is coming, we have to get money, we have no choice. It cost
          money to eat and they don’t want you to eat.
        </p>
      </div>
    </div>
  );
};
