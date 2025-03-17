import { useState } from "react";
import Jeu from "./composants/Jeu";
import ClashLogo from "/src/assets/ClashLogo.png";

export default function Connexion() {
  const [pseudo, setPseudo] = useState("");
  const [duree, setDuree] = useState();
  const [startGame, setStartJeu] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!pseudo.trim()) {
      setError("Veuillez entrer un pseudo");
      return;
    }

    if (!duree || duree < 1) {
      setError("Veuillez entrer une durée valide (minimum 1 minute)");
      return;
    }

    setError("");
    setStartJeu(true);
  }

  function handleReset() {
    setPseudo("");
    setDuree(3);
    setError("");
    setStartJeu(false);
  }

  if (startGame) {
    return <Jeu pseudo={pseudo} duree={duree} onRetour={handleReset} />;
  }

  let affichageDuree;
  if (duree >= 2) {
    affichageDuree = <p>Durée : {duree} minutes</p>;
  } else {
    affichageDuree = <p>Durée : {duree} minute</p>;
  }

  return (
    <div className="app-container">
      <div id="login">
        <div className="login-header">
          <img src={ClashLogo} alt="Clash Royale" className="logo" />
          <h1>MemoRoyale</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Pseudo
            <input
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              type="text"
              name="pseudo"
              placeholder="Maitre des cartes"
            />
          </label>

          <label>
            Temps (minutes)
            <input
              value={duree}
              onChange={(e) => setDuree(Number(e.target.value))}
              type="number"
              min="1"
              max="10"
              name="temps"
              placeholder="3"
            />
          </label>

          <hr />

          <div className="button-group">
            <button type="submit" className="btn-play">
              Jouer
            </button>
            <button type="button" onClick={handleReset} className="btn-reset">
              Effacer
            </button>
          </div>
        </form>

        <div className="player-info">
          {pseudo && <p>Bienvenue {pseudo}</p>}
          {affichageDuree}
        </div>
      </div>
    </div>
  );
}
