import React from "react";
import Link from "next/link";

const FAQ = () => {
  return (
    <div className="max-w-7/8 lg:max-w-7xl w-full">
      <h2 className="text-4xl">Frequently Asked Questions</h2>

      <div className="text-start mt-8">
        <h2 className="text-2xl">Why should I use this?</h2>
        <p className="mt-4 text-lg text-gray-500">
          Other than seeing your timetable in a beautiful user interface, our
          timetable planner is also packed with functionality. You can set
          constraints such as free days, free hours, take certain indexes (with
          your friends), and we can generate the best options for you to choose.
          If you are still not satisfied, you can also manually edit. Clicking a
          lesson shows you all the possible indexes to take.
        </p>
      </div>
      <div className="text-start mt-8">
        <h2 className="text-2xl">Do I need an account?</h2>
        <p className="mt-4 text-lg text-gray-500">
          No, you can use the planner without an account. However, if you want
          to save your timetable, and access from multiple devices, you will
          need to create an account.
        </p>
      </div>
      <div className="text-start mt-8">
        <h2 className="text-2xl">
          I have some suggestion/bugs to report. How can I do that?
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          You can use the form{" "}
          <Link href="/contact" className="text-blue-600">
            here
          </Link>
        </p>
      </div>
      <div className="text-start mt-8">
        <h2 className="text-2xl">Is this using the latest data?</h2>
        <p className="mt-4 text-lg text-gray-500">
          Yes. The backend is automtically checked and updated every day. Check{" "}
          <Link href="/mods" className="text-blue-600">
            here
          </Link>{" "}
          to see which semester the current data is from.
        </p>
      </div>
      <div className="text-start mt-8">
        <h2 className="text-2xl">Is this open source?</h2>
        <p className="mt-4 text-lg text-gray-500">
          Yes! See the{" "}
          <Link href="/about" className="text-blue-600">
            About
          </Link>{" "}
          page for more information on the source code and how to contribute.
        </p>
      </div>
    </div>
  );
};

export default FAQ;
