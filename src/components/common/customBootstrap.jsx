import { Col } from 'reactstrap';
import PropTypes from 'prop-types';

const Colxx = (props) => <Col {...props} widths={['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']} />;
const Separator = ({ className }) => <div className={`separator ${className}`} />;
export { Colxx, Separator };

Separator.propTypes = {
  className: PropTypes.string,
};
