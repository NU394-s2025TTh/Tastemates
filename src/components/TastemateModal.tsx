import './TastemateModal.css';

const TastemateModal = ({ tastemate, onClose }: any) => {
  if (!tastemate) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <img src={tastemate.photoURL} alt="Profile" className="modal-pic" />
        <h2>{tastemate.displayName}</h2>
        <div className="contact-centered">
          <p className="contact-centered-email">
            <strong>Email:</strong> {tastemate.email}
          </p>
          {tastemate.phoneNumber && (
            <p className="contact-centered-phone">
              <strong>Phone: </strong>
              {tastemate.phoneNumber}
            </p>
          )}
        </div>

        <h3 className="fav-cuisines">Favorite Cuisines</h3>
        <div className="modal-cuisines">
          {tastemate.cuisines?.length ? (
            tastemate.cuisines.map((c: string) => (
              <p className="cuisine-tag" key={c}>
                {c}
              </p>
            ))
          ) : (
            <p>No cuisines listed</p>
          )}
        </div>

        <h3>Price Range</h3>
        <p className="contact-centered">
          ${tastemate.minPrice ?? 0} - ${tastemate.maxPrice ?? 100}
        </p>

        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TastemateModal;
