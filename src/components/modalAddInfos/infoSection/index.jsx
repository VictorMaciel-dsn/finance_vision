import { InputText } from 'primereact/inputtext';
import { Button } from 'reactstrap';

function InfoSection({
  title = '',
  value = '',
  setValue = () => {},
  isOpen = false,
  toggleOpen = () => {},
  onSubmit = (e) => e.preventDefault(),
  icon = '',
  color = '',
  placeholderText = '',
}) {
  return (
    <>
      <div className={isOpen ? 'card active' : 'card'}>
        <div className="container">
          <div className="label-container">
            <div className="background-icon-custom first">
              <i className={`${icon} ${color}`} />
            </div>
            <div className="text">{title}</div>
          </div>
          <div className="background-icon">
            <i className={isOpen ? 'pi pi-angle-up' : 'pi pi-plus'} onClick={toggleOpen} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="card active wow animate__animated animate__fadeIn">
          <form onSubmit={onSubmit}>
            <div className="container">
              <div className="label-container">
                <InputText
                  required
                  type="number"
                  className="input-form w-100"
                  placeholder={placeholderText}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <Button type="submit" className="btn-send">
                <i className="pi pi-send" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default InfoSection;
