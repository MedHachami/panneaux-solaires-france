import { useState } from "react";

import { submitLead } from '../lib/supabase.js';

export default function HeroForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postalCode: '',
    projectType: 'maison-individuelle'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await submitLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        postal_code: formData.postalCode,
        project_type: formData.projectType,
        form_type: 'hero_quick'
      });

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          postalCode: '',
          projectType: 'maison-individuelle'
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hero-form-container">
      <div className="hero-form-card">
        <div className="form-header">
          <h3>Obtenez votre devis gratuit en 24h</h3>
          <p>Installation solaire professionnelle partout en France</p>
        </div>

        <form onSubmit={handleSubmit} className="hero-form">
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Votre nom complet"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="votre@email.com"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="06 12 34 56 78"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Code postal"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="maison-individuelle">Maison individuelle</option>
              <option value="appartement">Appartement</option>
              <option value="entreprise">Entreprise</option>
              <option value="autre">Autre projet</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="hero-form-submit"
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                📞 Recevoir mon devis gratuit
              </>
            )}
          </button>

          {submitStatus == 'success' && (
            <div className="form-message success">
              ✅ Merci ! Votre demande a été envoyée. Nous vous contacterons sous 24h.
            </div>
          )}

          {submitStatus == 'error' && (
            <div className="form-message error">
              ❌ Erreur lors de l'envoi. Veuillez réessayer ou nous contacter directement.
            </div>
          )}
        </form>

        <div className="form-footer">
          <p>🔒 Données sécurisées • 📞 Réponse garantie • ⚡ Installation rapide</p>
        </div>
      </div>
    </div>
  );
}