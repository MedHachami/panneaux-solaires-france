import {
  FaShieldAlt,
  FaClock,
  FaAward,
  FaEuroSign,
  FaLeaf,
  FaTools,
  FaCertificate
} from 'react-icons/fa';

const TrustBadges = () => {
  return (
    <div className="trust-badges">
      <div className="badge">
        <FaShieldAlt className="icon" />
        <span>Données sécurisées</span>
      </div>
      <div className="badge">
        <FaClock className="icon" />
        <span>Réponse sous 24h</span>
      </div>
      <div className="badge">
        <FaAward className="icon" />
        <span>Qualité garantie</span>
      </div>
      <div className="badge">
        <FaCertificate className="icon" />
        <span>Expertise certifiée RGE</span>
      </div>
      <div className="badge">
        <FaEuroSign className="icon" />
        <span>Devis gratuit</span>
      </div>
      <div className="badge">
        <FaLeaf className="icon" />
        <span>Énergie verte</span>
      </div>
      <div className="badge">
        <FaTools className="icon" />
        <span>Installation pro</span>
      </div>
    </div>
  );
};

export default TrustBadges;