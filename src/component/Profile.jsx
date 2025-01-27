import { useState, useEffect } from 'react';
import axios from 'axios';

import "../style/Profile.css";

const Profile = (props) => {
    // バックエンドのAPIからjsonデータを取得
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        // コンポーネントがマウントされたときにデータを取得
        axios.get('https://sjc-portfolio.hockey0513hockey.workers.dev/api/profiles')
          .then(response => {
            setProfiles(response.data);
          })
          .catch(error => {
            console.error('Error fetching profiles:', error);  // エラーが発生した場合の処理
          });
    }, []);

    return (
      <div>
        {profiles.map(profile => (
          <div key={profile.id} className="profile-container nes-container is-rounded is-dark">
            <div className="profile-data-container-1">
              <div className="profile-icon-container nes-container is-rounded is-dark">
                <img className="profile-icon" src="/img/cat_icons/profile_icon.png" alt="Profile Icon" />
              </div>
              <div className="profile-name-and-age-container">
                <p className="name-label">Name：
                </p>
                <p className="name-value">{profile.name}</p>
                <p className="age-label-and-value">Age：{profile.age}</p>
                <p className="blood-type-label-and-value">BloodType：{profile.blood_type}</p>
              </div>
            </div>
            <div className="profile-birthday-container">
              <p className="birthday-label-and-value">Birthday：{profile.birthday}</p>
            </div>
            <div className="profile-mail-address-container">
                <p className="mail-address-label">MailAddress：</p>
                <p className="mail-address-value">{profile.mail_address}</p>
              </div>
          </div>
        ))}
      </div>
    );
  };
  
export default Profile;
