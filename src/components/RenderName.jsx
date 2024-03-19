import PropTypes from 'prop-types';

const RenderName = (props) => {
  return(<div>
    {props.firstName} {props.middleName ? props.middleName : null} {props.lastName}
</div>);
};

RenderName.propTypes = {
  firstName: PropTypes.string.isRequired,
  middleName: PropTypes.string,
  lastName: PropTypes.string.isRequired,
};

RenderName.defaultProps = {
    middleName: 'Augustus',
  };

export default RenderName;