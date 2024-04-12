import React from "react";
import "../styles/bookshelf.css";
import img1 from "../img/bg.png";
function Bookshelf() {
  return (
    <div id="main-box">
      <section id="one" className="tiles">
        <article>
          <span className="image">
            <img
              src="https://th.bing.com/th/id/OIP.6DGciKDYNMB3oDUsE8zFgAHaFE?rs=1&pid=ImgDetMain"
              alt=""
            />
          </span>
          <header className="major">
            <h3>Scan Your Resume</h3>
            <p>
              Upload your resume as a Word Document or PDF file in order to get
              valuable information about your resume.
            </p>
          </header>
        </article>
        <article>
          <span className="image">
            <img src={img1} alt="" />
          </span>
          <header className="major">
            <h3>Why use a resume checker?</h3>
            <p>
              {" "}
              From simple spelling mistakes to more hard-to-notice issues like
              passive language, there’s a lot that could be wrong with your
              resume. The average job seeker might not notice these issues – but
              employers do. Our resume checker was designed by career experts
              and recruiters to scan for all the details that hiring managers
              look for when reviewing a job applicant. Then it gives you
              immediate feedback on ways you can improve your resume.
            </p>
          </header>
        </article>
        <article>
          <span className="image">
            <img src="./images/pic03.jpg" alt="" />
          </span>
          <header className="major">
            <h3>Perfect Your Resume</h3>
            <p>
              {" "}
              Once you’ve pinpointed the weaker parts of your resume, you can
              work on fixing them in order to take your resume to that next
              level and secure more job interviews!
            </p>
          </header>
        </article>
        <article>
          <span className="image">
            <img src="./images/pic04.jpg" alt="" />
          </span>
          <header className="major">
            <h3>Get hired fast with advanced job search features</h3>
            <p>
              Gaining a competitive edge is critical in today’s hiring climate.
              Explore premium features designed to set you apart from the
              competition.
            </p>
          </header>
        </article>
        <article>
          <span className="image">
            <img src="images/pic05.jpg" alt="" />
          </span>
          <header className="major">
            <h3>Private and Secure</h3>
            <p>
              We value your privacy so much that we take every possible measure
              to protect and secure your data: secure servers, total
              transparency and strict policies. We don’t share your resume with
              anyone. You may request to delete your data from our servers at
              anytime.
            </p>
          </header>
        </article>
        <article>
          <span className="image">
            <img src="images/pic06.jpg" alt="" />
          </span>
          <header className="major">
            <h3>Speed up your job search, free up your time</h3>
            <p>
              Applying for jobs is time consuming! Our job scanner has already
              analyzed thousands of job descriptions to help identify the best
              keywords to use on your resume. Using the right keywords is
              important when applying through an applicant tracking system.
              Upload a resume and job description to SkillSyncer, and we provide
              an instant match score and job match report.
            </p>
          </header>
        </article>
      </section>

      {/* Two */}
      <section id="two">
        <div className="inner">
          <header className="major">
            <h2>Check Resume Now </h2>
          </header>
          <p>
            Concerned your resume isn’t good enough? Get instant feedback and
            suggestions using our resume scanner. Have you been
            applying for dozens of jobs but haven’t gotten a single offer? It’s
            possible that your resume has issues that are preventing you from
            landing an interview.
          </p>
          <ul className="actions">
            <li><a href="/register" className="button-btn next">Get Started</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Bookshelf;
