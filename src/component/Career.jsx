import CareerItem from './CareerItem';

const Career = (props) => {
  const {careers} = props;

  return (
    <div>
      {careers.map(career => (
        <CareerItem key={career.id} career={career} />
      ))}
    </div>
  );
};
  
export default Career;
