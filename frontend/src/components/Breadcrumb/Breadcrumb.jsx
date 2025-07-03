// src/components/Breadcrumb.jsx
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="breadcrumb">
      <Link to="/" className="breadcrumb-link">Home</Link>
      {pathnames.map((name, index) => {
        const routeTo = '/' + pathnames.slice(0, index + 1).join('/');
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <span key={index} className="breadcrumb-current"> &gt; {decodeURIComponent(name)}</span>
        ) : (
          <span key={index}>
            {' '}
            &gt; <Link to={routeTo} className="breadcrumb-link">{decodeURIComponent(name)}</Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
