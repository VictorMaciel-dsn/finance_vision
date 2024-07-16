import Footer from '../../footer';
import TopNav from '../../topnav';
import { useEffect, useRef, useState } from 'react';
import { parseJwt, validarEmail } from '../../../../helpers/format';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth, storage } from '../../../../services';
import { useNavigate } from 'react-router-dom';
import ptBrImage from '../../../../assets/img/pt-br.png';
import enUsImage from '../../../../assets/img/en-us.png';
import {
  getCurrentLanguage,
  getCurrentTheme,
  getCurrentUser,
  setCurrentLanguage,
  setCurrentTheme,
} from '../../../../helpers/utils';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { tokenUser, updateImageUser } from '../../../../atoms/user';
import { langStorageKey, themeStorageKey, userStorageKey } from '../../../../constants/defaultValues';
import { useIonToast } from '@ionic/react';
import { InputText } from 'primereact/inputtext';
import LoadingComponent from '../../../../components/loading';
import { currentColor } from '../../../../atoms/theme';
import { injectIntl } from 'react-intl';
import { currentLanguage } from '../../../../atoms/lang';
import { FileUpload } from 'primereact/fileupload';
import * as FireBaseStorage from 'firebase/storage';
import { get, getDatabase, ref, set } from 'firebase/database';
import defaultProfileImage from '../../../../assets/img/profile-image.jpg';

function ConfigPage({ intl }) {
  const { messages } = intl;
  const navigate = useNavigate();
  const [toast] = useIonToast();
  const _userToken = getCurrentUser();
  const userToken = useRecoilValue(tokenUser);
  const [emailUser, setEmailUser] = useState('');
  const [isLang, setIsLang] = useState(false);
  const [ptBr, setPtBr] = useState(true);
  const [enUs, setEnUs] = useState(false);
  const [themeWhite, setThemeWhite] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [emailChangePassword, setEmailChangePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setTheme = useSetRecoilState(currentColor);
  const setLang = useSetRecoilState(currentLanguage);
  const currentLang = getCurrentLanguage();
  const currentTheme = getCurrentTheme();
  const [isChangeImage, setIsChangeImage] = useState(false);
  const [img, setImg] = useState('');
  const [nameImg, setNameImg] = useState('');
  const isFirst = useRef(true);
  const [profileImage, setProfileImage] = useState('');
  const [initialNameImage, setInitialNameImage] = useState('');
  const [isUpdateImage, setIsUpdateImage] = useRecoilState(updateImageUser);

  useEffect(() => {
    if (currentLang === 'pt-br') {
      setPtBr(true);
      setEnUs(false);
    } else {
      setPtBr(false);
      setEnUs(true);
    }
  }, [currentLang]);

  useEffect(() => {
    if (_userToken) {
      let token = parseJwt(_userToken);
      setEmailUser(token.email);
    } else {
      let token = parseJwt(userToken);
      setEmailUser(token.email);
    }
  }, [_userToken]);

  useEffect(() => {
    if (currentTheme === 'dark') {
      setThemeWhite(false);
    } else {
      setThemeWhite(true);
    }
  }, [currentTheme]);

  useEffect(() => {
    if (isFirst.current || isUpdateImage) {
      getImage()
        .then((res) => {
          if (res !== null) {
            setProfileImage(res.img);
            setInitialNameImage(res.imgName);
          }
        })
        .catch((error) => {
          console.error('Erro ao obter a imagem:', error);
        });
      isFirst.current = false;
    }
  }, [isUpdateImage]);

  function logout() {
    signOut(auth)
      .then(() => {
        navigate('/');
        localStorage.removeItem(userStorageKey);
        localStorage.removeItem(langStorageKey);
        localStorage.removeItem(themeStorageKey);
        setLang('pt-br');
      })
      .catch(() => {
        toast({
          message: messages['message.disconnectError'],
          duration: 2000,
          position: 'bottom',
        });
      });
  }

  function submitChangePassword(e) {
    e.preventDefault();

    if (validarEmail(emailChangePassword)) {
      setIsLoading(true);
      sendPasswordResetEmail(auth, emailChangePassword)
        .then(() => {
          setTimeout(() => {
            setIsLoading(false);
            setEmailChangePassword('');
            setIsChangePassword(false);
            toast({
              message: messages['message.sendEmailSuccess'],
              duration: 2000,
              position: 'bottom',
            });
          }, 2500);
        })
        .catch(() => {
          setTimeout(() => {
            setIsLoading(false);
            toast({
              message: messages['message.sendEmailError'],
              duration: 2000,
              position: 'bottom',
            });
          }, 2500);
        });
    } else {
      toast({
        message: messages['message.emailInvalid'],
        duration: 2000,
        position: 'bottom',
      });
    }
  }

  function submitChangeImage() {
    if (!img) return;
    setIsLoading(true);
    const storageRef = FireBaseStorage.ref(storage, `files/${nameImg}`);
    const uploadTask = FireBaseStorage.uploadBytesResumable(storageRef, img);

    uploadTask.on('state_changed', () => {
      FireBaseStorage.getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        onSave(downloadURL);
      });
    });
  }

  function onSave(img) {
    const db = getDatabase();
    const dataRef = ref(db, 'images');
    const imagePath = `files/${initialNameImage}`;
    const refItem = FireBaseStorage.ref(storage, imagePath);

    let payload = {
      img: img,
      imgName: nameImg,
    };

    set(dataRef, payload)
      .then(() => {
        setImg('');
        setNameImg('');
        setIsChangeImage(false);
        setIsLoading(false);
        FireBaseStorage.deleteObject(refItem);
        setIsUpdateImage(true);
        toast({
          message: messages['message.imageSavedSuccess'],
          duration: 2000,
          position: 'bottom',
        });
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          message: messages['message.imageSavedError'],
          duration: 2000,
          position: 'bottom',
        });
      });
  }

  async function getImage() {
    const db = getDatabase();
    const dataRef = ref(db, 'images');

    try {
      const res = await get(dataRef);
      return res.val();
    } catch {
      return null;
    }
  }

  return (
    <>
      <LoadingComponent isLoading={isLoading} text={messages['message.wait']} />
      <div className="config-page">
        <TopNav />
        <div className="screen wow animate__animated animate__fadeIn">
          <div className="container-img">
            <img src={profileImage ? profileImage : defaultProfileImage} />
            <label>
              {emailUser ? (
                emailUser
              ) : (
                <>
                  {messages['message.emailNotFound']} <i className="pi pi-exclamation-circle" />
                </>
              )}
            </label>
          </div>

          <div className="container-configs mt-3">
            <label>{messages['message.preferences']}</label>
            <div className={isLang ? 'card active' : 'card'}>
              <div className="container">
                <div className="label-container">
                  <div className="background-icon first">
                    <i className="pi pi-language" />
                  </div>
                  <div className="text">{messages['message.changeLanguage']}</div>
                </div>
                <div className="background-icon">
                  <i
                    className={isLang ? 'pi pi-angle-up' : 'pi pi-angle-down'}
                    onClick={() => {
                      setIsLang(!isLang);
                    }}
                  />
                </div>
              </div>
            </div>
            {isLang ? (
              <div
                className={
                  isLang
                    ? 'card active wow animate__animated animate__fadeIn'
                    : 'card wow animate__animated animate__fadeIn'
                }
              >
                <FormGroup switch>
                  <Input
                    className={ptBr ? 'active' : ''}
                    type="switch"
                    checked={ptBr}
                    onChange={() => {
                      setPtBr(!ptBr);
                      setEnUs(!enUs);
                      setLang('pt-br');
                      setCurrentLanguage('pt-br');
                    }}
                  />
                  <Label check>
                    <img src={ptBrImage} /> {messages['message.ptBr']}
                  </Label>
                </FormGroup>
                <FormGroup switch>
                  <Input
                    className={enUs ? 'active' : ''}
                    type="switch"
                    checked={enUs}
                    onChange={() => {
                      setEnUs(!enUs);
                      setPtBr(!ptBr);
                      setLang('en');
                      setCurrentLanguage('en');
                    }}
                  />
                  <Label check>
                    <img src={enUsImage} /> {messages['message.enUs']}
                  </Label>
                </FormGroup>
              </div>
            ) : (
              <></>
            )}
            <div className="card">
              <div className="container">
                <div className="label-container">
                  <div className="background-icon first">
                    <i className="pi pi-sun" />
                  </div>
                  <div className="text">{messages['message.clearTheme']}</div>
                </div>
                <FormGroup switch>
                  <Input
                    className={themeWhite ? 'active' : ''}
                    type="switch"
                    checked={themeWhite}
                    onChange={(e) => {
                      setThemeWhite(!themeWhite);
                      if (e.target.checked) {
                        setTheme('light');
                        setCurrentTheme('light');
                      } else {
                        setTheme('dark');
                        setCurrentTheme('dark');
                      }
                    }}
                  />
                </FormGroup>
              </div>
            </div>
          </div>
          <div className="container-configs mt-3">
            <label>{messages['message.account']}</label>
            <div className={isChangeImage ? 'card active' : 'card'}>
              <div className="container">
                <div className="label-container">
                  <div className="background-icon first">
                    <i className="pi pi-image" />
                  </div>
                  <div className="text">{messages['message.changeImage']}</div>
                </div>
                <div className="background-icon">
                  <i
                    className={isChangeImage ? 'pi pi-angle-up' : 'pi pi-pencil'}
                    onClick={() => {
                      setIsChangeImage(!isChangeImage);
                    }}
                  />
                </div>
              </div>
            </div>
            {isChangeImage ? (
              <div
                className={
                  isChangeImage
                    ? 'card active wow animate__animated animate__fadeIn'
                    : 'card wow animate__animated animate__fadeIn'
                }
              >
                <div className="container-fileUpload">
                  <FileUpload
                    className={img ? 'mb-2' : ''}
                    mode="basic"
                    accept="image/*"
                    maxFileSize={1000000}
                    chooseLabel={messages['message.chooseImage']}
                    onSelect={(e) => {
                      setImg(e.files[0]);
                      const id = new Date().getTime() % 10000;
                      const extension = e.files[0].name.split('.').pop();
                      const fileName = `${e.files[0].name.split('.').slice(0, -1).join('.')}-${id}.${extension}`;
                      setNameImg(fileName);
                    }}
                  />
                  {img ? (
                    <>
                      <div className="image wow animate__animated animate__fadeIn">
                        <img src={img?.objectURL} alt="img_user" />
                      </div>
                      <div className="actions mt-2">
                        <Button
                          className="btn-save"
                          onClick={() => {
                            submitChangeImage();
                          }}
                        >
                          <i className="pi pi-save" /> {messages['message.save']}
                        </Button>
                        <Button
                          className="btn-cancel"
                          onClick={() => {
                            setImg('');
                            setNameImg('');
                            setIsChangeImage(false);
                          }}
                        >
                          <i className="pi pi-times" /> {messages['message.cancel']}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className={isChangePassword ? 'card active' : 'card'}>
              <div className="container">
                <div className="label-container">
                  <div className="background-icon first">
                    <i className="pi pi-key" />
                  </div>
                  <div className="text">{messages['message.changePassword']}</div>
                </div>
                <div className="background-icon">
                  <i
                    className={isChangePassword ? 'pi pi-angle-up' : 'pi pi-pencil'}
                    onClick={() => {
                      setIsChangePassword(!isChangePassword);
                    }}
                  />
                </div>
              </div>
            </div>
            {isChangePassword ? (
              <div
                className={
                  isChangePassword
                    ? 'card active wow animate__animated animate__fadeIn'
                    : 'card wow animate__animated animate__fadeIn'
                }
              >
                <form onSubmit={(e) => submitChangePassword(e)}>
                  <div className="container">
                    <div className="label-container">
                      <div className="background-icon first">
                        <i className="pi pi-envelope" />
                      </div>
                      <InputText
                        required
                        className="input-form w-100"
                        placeholder={messages['message.enterYourEmail']}
                        value={emailChangePassword}
                        onChange={(e) => setEmailChangePassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="btn-send">
                      <i className="pi pi-send" />
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="container-btn">
            <Button
              className="mt-2"
              onClick={() => {
                logout();
              }}
            >
              <i className="pi pi-sign-out" /> {messages['message.logout']}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default injectIntl(ConfigPage);
