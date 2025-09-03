import { useState } from "react";
import { submitLead } from '../lib/supabase.js';
import TrustBadges from './TrustBadges.jsx';

export default function LeadForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    status: '',
    propertyType: '',
    heatingType: '',
    energyBill: '',
    department: '',
    fullName: '',
    phone: '',
    email: '',
    address: '',
    callback: false,
    newsletter: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const requiredFields = ['status', 'propertyType', 'heatingType', 'energyBill', 'department'];
    const newErrors = {};

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Ce champ est requis';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await submitLead({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        postal_code: formData.department,
        project_type: `${formData.status} - ${formData.propertyType}`,
        heating_type: formData.heatingType,
        current_energy_bill: formData.energyBill,
        preferred_contact_time: formData.callback ? 'Oui' : null,
        newsletter: formData.newsletter,
        form_type: 'multi_step_solar_form'
      });

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          status: '',
          propertyType: '',
          heatingType: '',
          energyBill: '',
          department: '',
          fullName: '',
          phone: '',
          email: '',
          address: '',
          callback: false,
          newsletter: false
        });
        setCurrentStep(1);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-section-wrapper">
      <div className="container">
        <div className="form-section-header">
          <div className="form-section-badge">
            <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="9"/>
            </svg>
            Devis Gratuit 24h
          </div>
          <h2 className="section-title">Demandez Votre Devis Photovoltaïque Gratuit</h2>
          <p className="form-section-description">
            Notre engagement : Réponse sous 24h avec une étude personnalisée.
            Plus de 10 000 clients satisfaits nous font confiance pour leur transition énergétique solaire.
          </p>
        </div>

        <div className="form-layout">
          {/* Left Column - Content */}
          <div className="form-content-column">
           
            <div className="content-text">
              <h3>Pourquoi choisir Autoconsommation Solaire france ?</h3>
              
              <TrustBadges />
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="form-column">
            <div className="form-card-compact">
              <div className="form-header-compact">
                <h3>☀️ Devis Panneaux Photovoltaïques</h3>
                <p>Répondez à quelques questions et recevez une étude personnalisée</p>
              </div>

              <div className="step-indicator-compact">
                <div className={`step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
                  <div className="step-circle">{currentStep > 1 ? '✓' : '1'}</div>
                  <div className="step-title">Informations Projet</div>
                </div>
                <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
                  <div className="step-circle">2</div>
                  <div className="step-title">Coordonnées</div>
                </div>
              </div>

              <form className="form-content-compact" onSubmit={handleSubmit}>
                {/* Step 1: Project Information */}
                <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                  <div className="form-section-compact">
                    <h4 className="form-section-title-compact">
                      <i className="fas fa-user-tie"></i> Vous êtes
                    </h4>
                    <div className="form-group-compact">
                      <select
                        name="status"
                        id="status"
                        className={`form-select-compact ${errors.status ? 'error' : ''}`}
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="">Sélectionnez votre statut</option>
                        <option value="owner">Propriétaire</option>
                        <option value="tenant">Locataire</option>
                      </select>
                    </div>
                    {errors.status && <span className="error-text">{errors.status}</span>}
                  </div>

                  <div className="form-section-compact">
                    <h4 className="form-section-title-compact">
                      <i className="fas fa-home"></i> Votre projet concerne
                    </h4>
                    <div className="form-group-compact">
                      <select
                        name="propertyType"
                        id="propertyType"
                        className={`form-select-compact ${errors.propertyType ? 'error' : ''}`}
                        value={formData.propertyType}
                        onChange={handleInputChange}
                      >
                        <option value="">Sélectionnez le type de bien</option>
                        <option value="house">Maison</option>
                        <option value="apartment">Appartement</option>
                      </select>
                    </div>
                    {errors.propertyType && <span className="error-text">{errors.propertyType}</span>}
                  </div>

                  <div className="form-section-compact">
                    <h4 className="form-section-title-compact">
                      <i className="fas fa-fire"></i> Type de chauffage actuel
                    </h4>
                    <div className="form-group-compact">
                      <select
                        name="heatingType"
                        id="heatingType"
                        className={`form-select-compact ${errors.heatingType ? 'error' : ''}`}
                        value={formData.heatingType}
                        onChange={handleInputChange}
                      >
                        <option value="">Sélectionnez votre chauffage</option>
                        <option value="gas">Gaz</option>
                        <option value="oil">Fioul</option>
                        <option value="wood">Bois</option>
                        <option value="electric">Électricité</option>
                      </select>
                    </div>
                    {errors.heatingType && <span className="error-text">{errors.heatingType}</span>}
                  </div>

                  <div className="form-section-compact">
                    <h4 className="form-section-title-compact">
                      <i className="fas fa-receipt"></i> Montant annuel de votre facture
                    </h4>
                    <div className="form-group-compact">
                      <select
                        name="energyBill"
                        id="energyBill"
                        className={`form-select-compact ${errors.energyBill ? 'error' : ''}`}
                        value={formData.energyBill}
                        onChange={handleInputChange}
                      >
                        <option value="">Sélectionnez votre facture annuelle</option>
                        <option value="less-1200">Moins de 1 200 €</option>
                        <option value="1200-1500">De 1 200 à 1 500 €</option>
                        <option value="1500-2000">De 1 500 à 2 000 €</option>
                        <option value="2000-2500">De 2 000 à 2 500 €</option>
                        <option value="more-2500">Plus de 2 500 €</option>
                      </select>
                    </div>
                    {errors.energyBill && <span className="error-text">{errors.energyBill}</span>}
                  </div>

                  <div className="form-section-compact">
                    <h4 className="form-section-title-compact">
                      <i className="fas fa-map-marker-alt"></i> Votre département
                    </h4>
                    <div className="form-group-compact">
                      <i className="fas fa-map-pin form-input-icon"></i>
                      <select
                        name="department"
                        id="department"
                        className="form-select-compact"
                        value={formData.department}
                        onChange={handleInputChange}
                      >
                        <option value="">Sélectionnez votre département</option>
                        <option value="01">Ain (01)</option>
                        <option value="02">Aisne (02)</option>
                        <option value="03">Allier (03)</option>
                        <option value="04">Alpes-de-Haute-Provence (04)</option>
                        <option value="05">Hautes-Alpes (05)</option>
                        <option value="06">Alpes-Maritimes (06)</option>
                        <option value="07">Ardèche (07)</option>
                        <option value="08">Ardennes (08)</option>
                        <option value="09">Ariège (09)</option>
                        <option value="10">Aube (10)</option>
                        <option value="11">Aude (11)</option>
                        <option value="12">Aveyron (12)</option>
                        <option value="13">Bouches-du-Rhône (13)</option>
                        <option value="14">Calvados (14)</option>
                        <option value="15">Cantal (15)</option>
                        <option value="16">Charente (16)</option>
                        <option value="17">Charente-Maritime (17)</option>
                        <option value="18">Cher (18)</option>
                        <option value="19">Corrèze (19)</option>
                        <option value="21">Côte-d'Or (21)</option>
                        <option value="22">Côtes-d'Armor (22)</option>
                        <option value="23">Creuse (23)</option>
                        <option value="24">Dordogne (24)</option>
                        <option value="25">Doubs (25)</option>
                        <option value="26">Drôme (26)</option>
                        <option value="27">Eure (27)</option>
                        <option value="28">Eure-et-Loir (28)</option>
                        <option value="29">Finistère (29)</option>
                        <option value="30">Gard (30)</option>
                        <option value="31">Haute-Garonne (31)</option>
                        <option value="32">Gers (32)</option>
                        <option value="33">Gironde (33)</option>
                        <option value="34">Hérault (34)</option>
                        <option value="35">Ille-et-Vilaine (35)</option>
                        <option value="36">Indre (36)</option>
                        <option value="37">Indre-et-Loire (37)</option>
                        <option value="38">Isère (38)</option>
                        <option value="39">Jura (39)</option>
                        <option value="40">Landes (40)</option>
                        <option value="41">Loir-et-Cher (41)</option>
                        <option value="42">Loire (42)</option>
                        <option value="43">Haute-Loire (43)</option>
                        <option value="44">Loire-Atlantique (44)</option>
                        <option value="45">Loiret (45)</option>
                        <option value="46">Lot (46)</option>
                        <option value="47">Lot-et-Garonne (47)</option>
                        <option value="48">Lozère (48)</option>
                        <option value="49">Maine-et-Loire (49)</option>
                        <option value="50">Manche (50)</option>
                        <option value="51">Marne (51)</option>
                        <option value="52">Haute-Marne (52)</option>
                        <option value="53">Mayenne (53)</option>
                        <option value="54">Meurthe-et-Moselle (54)</option>
                        <option value="55">Meuse (55)</option>
                        <option value="56">Morbihan (56)</option>
                        <option value="57">Moselle (57)</option>
                        <option value="58">Nièvre (58)</option>
                        <option value="59">Nord (59)</option>
                        <option value="60">Oise (60)</option>
                        <option value="61">Orne (61)</option>
                        <option value="62">Pas-de-Calais (62)</option>
                        <option value="63">Puy-de-Dôme (63)</option>
                        <option value="64">Pyrénées-Atlantiques (64)</option>
                        <option value="65">Hautes-Pyrénées (65)</option>
                        <option value="66">Pyrénées-Orientales (66)</option>
                        <option value="67">Bas-Rhin (67)</option>
                        <option value="68">Haut-Rhin (68)</option>
                        <option value="69">Rhône (69)</option>
                        <option value="70">Haute-Saône (70)</option>
                        <option value="71">Saône-et-Loire (71)</option>
                        <option value="72">Sarthe (72)</option>
                        <option value="73">Savoie (73)</option>
                        <option value="74">Haute-Savoie (74)</option>
                        <option value="75">Paris (75)</option>
                        <option value="76">Seine-Maritime (76)</option>
                        <option value="77">Seine-et-Marne (77)</option>
                        <option value="78">Yvelines (78)</option>
                        <option value="79">Deux-Sèvres (79)</option>
                        <option value="80">Somme (80)</option>
                        <option value="81">Tarn (81)</option>
                        <option value="82">Tarn-et-Garonne (82)</option>
                        <option value="83">Var (83)</option>
                        <option value="84">Vaucluse (84)</option>
                        <option value="85">Vendée (85)</option>
                        <option value="86">Vienne (86)</option>
                        <option value="87">Haute-Vienne (87)</option>
                        <option value="88">Vosges (88)</option>
                        <option value="89">Yonne (89)</option>
                        <option value="90">Territoire de Belfort (90)</option>
                        <option value="91">Essonne (91)</option>
                        <option value="92">Hauts-de-Seine (92)</option>
                        <option value="93">Seine-Saint-Denis (93)</option>
                        <option value="94">Val-de-Marne (94)</option>
                        <option value="95">Val-d'Oise (95)</option>
                      </select>
                    </div>
                    {errors.department && <span className="error-text">{errors.department}</span>}
                  </div>

                  <div className="form-buttons-compact">
                    <button type="button" className="form-button next-compact" onClick={nextStep}>
                      Suivant <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>

                {/* Step 2: Personal Information */}
                <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                  <div className="success-message-compact" style={{backgroundColor: '#ecfdf5', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                    <h4 style={{color: '#059669', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px'}}>
                      <i className="fas fa-check-circle"></i> Félicitations !
                    </h4>
                    <p style={{color: '#065f46', fontSize: '13px'}}>
                      Grâce à vos réponses, vous êtes éligible aux offres photovoltaïques.
                    </p>
                  </div>

                  <div className="form-section-compact">
                    <h4 className="form-section-title-compact">
                      <i className="fas fa-user-circle"></i> Vos coordonnées
                    </h4>
                    <div className="form-grid-compact">
                      <div className="form-group-compact">
                        <label className="form-label required">Nom complet</label>
                        <i className="fas fa-user form-input-icon"></i>
                        <input
                          type="text"
                          name="fullName"
                          id="fullName"
                          placeholder="Votre nom complet"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`form-input-compact ${errors.fullName ? 'error' : ''}`}
                          required
                        />
                        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                      </div>
                      <div className="form-group-compact">
                        <label className="form-label required">Téléphone</label>
                        <i className="fas fa-phone form-input-icon"></i>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          placeholder="06 12 34 56 78"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`form-input-compact ${errors.phone ? 'error' : ''}`}
                          required
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                      </div>
                      <div className="form-group-compact">
                        <label className="form-label required">Email</label>
                        <i className="fas fa-envelope form-input-icon"></i>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-input-compact ${errors.email ? 'error' : ''}`}
                          required
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                      </div>
                      <div className="form-group-compact">
                        <label className="form-label required">Adresse complète</label>
                        <i className="fas fa-map-marker-alt form-input-icon"></i>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          placeholder="123 Rue de la Paix, 75001 Paris"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`form-input-compact ${errors.address ? 'error' : ''}`}
                          required
                        />
                        {errors.address && <span className="error-text">{errors.address}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="form-section-compact">
                    <h4 className="form-section-title-compact">
                      <i className="fas fa-bell"></i> Préférences de contact
                    </h4>
                    <div className="checkbox-group-compact">
                      <div className="checkbox-option-compact">
                        <input
                          type="checkbox"
                          id="callback"
                          name="callback"
                          checked={formData.callback}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="callback">Je souhaite être rappelé par CALHAN ENERGIES</label>
                      </div>
                      <div className="checkbox-option-compact">
                        <input
                          type="checkbox"
                          id="newsletter"
                          name="newsletter"
                          checked={formData.newsletter}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="newsletter">Je souhaite recevoir les actualités</label>
                      </div>
                    </div>
                    <p style={{fontSize: '12px', color: 'var(--dark)', marginTop: '10px'}}>
                      En remplissant ce formulaire, vous acceptez notre politique de confidentialité.
                    </p>
                  </div>

                  <div className="form-buttons-compact">
                    <button type="button" className="form-button prev-compact" onClick={prevStep}>
                      <i className="fas fa-arrow-left"></i> Précédent
                    </button>
                    <button type="submit" className="form-button submit-compact" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="loading-spinner"></div> Envoi...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i> Envoyer
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="form-message success" style={{display: 'block'}}>
                    ✅ Merci ! Votre demande a été envoyée. Nous vous contacterons sous 24h.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="form-message error" style={{display: 'block'}}>
                    ❌ Erreur lors de l'envoi. Veuillez réessayer.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}