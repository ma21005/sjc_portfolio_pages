import "../style/CareerItem.css";

const CareerItem = ({ career }) => {
  return (
    <div className="career_container nes-container is-rounded is-dark">
      <div className="project_name_label nes-badge">
        <span className="is-primary">PROJECT NAME</span>
      </div>
      <div className="project_name_container">
        <p className="project_name">{career.project_name}</p>
      </div>
      <div className="project_dates_label nes-badge">
        <span className="is-warning">DATES</span>
      </div>
      <div className="project_dates_container">
        <p className="project_dates">{career.start_date} ～ {career.end_date}</p>
      </div>
      <div className="project_summary_label nes-badge">
        <span className="is-success">SUMMARY</span>
      </div>
      <div className="project_summary_container">
        <p className="project_summary">{career.description}</p>
      </div>
      <div className="project_tech_stack_label nes-badge">
        <span className="is-error">TECH STACK</span>
      </div>
      <div className="project_tech_stack_container">
        {career.skills.map(tech => (
          <img key={tech} className="tech_stack" src={`/img/skill_icons/${tech}.png`}  alt={`${tech} icon`} />
        ))}
      </div>
    </div>
  );
};

export default CareerItem;
