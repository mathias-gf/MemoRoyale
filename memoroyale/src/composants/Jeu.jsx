import { useState, useEffect } from "react";
import dosImage from "/src/cartes/MysteryCard.webp";
import image0 from "/src/cartes/0.webp";
import image1 from "/src/cartes/1.webp";
import image2 from "/src/cartes/2.webp";
import image3 from "/src/cartes/3.webp";
import image4 from "/src/cartes/4.webp";
import image5 from "/src/cartes/5.webp";

export default function Jeu({ pseudo, duree, onRetour }) {
  const [cartesRetournees, setCartesRetournees] = useState([]);
  const [pairesReussies, setPairesReussies] = useState([]);
  const [estRetournee, setestRetournee] = useState(false);
  const [cartes, setCartes] = useState([]);
  const [tempsRestant, setTempsRestant] = useState(duree * 60);
  const [partieTerminee, setPartieTerminee] = useState(false);

  const melangerTableau = (tableau) => {
    const nouveauTableau = [...tableau];
    for (let i = nouveauTableau.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nouveauTableau[i], nouveauTableau[j]] = [
        nouveauTableau[j],
        nouveauTableau[i],
      ];
    }
    return nouveauTableau;
  };

  const reinitialiserJeu = () => {
    const cartesInitiales = Array(12)
      .fill(null)
      .map((_, index) => ({
        id: index,
        valeur: Math.floor(index / 2),
      }));

    setCartes(melangerTableau(cartesInitiales));
    setCartesRetournees([]);
    setPairesReussies([]);
    setestRetournee(false);
    setPartieTerminee(false);
    setTempsRestant(duree * 60);
  };

  useEffect(() => {
    reinitialiserJeu();
  }, []);

  useEffect(() => {
    if (partieTerminee || pairesReussies.length === 6) return;

    const timer = setInterval(() => {
      setTempsRestant((temps) => {
        if (temps <= 1) {
          clearInterval(timer);
          setPartieTerminee(true);
          return 0;
        }
        return temps - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [partieTerminee, pairesReussies]);

  function handleClick(num_carte) {
    if (estRetournee || cartesRetournees.includes(num_carte) || partieTerminee)
      return;

    const nouvellesCartesRetournees = [...cartesRetournees, num_carte];
    setCartesRetournees(nouvellesCartesRetournees);

    if (nouvellesCartesRetournees.length === 2) {
      const [carte1, carte2] = nouvellesCartesRetournees;
      const valeur1 = cartes[carte1].valeur;
      const valeur2 = cartes[carte2].valeur;

      if (valeur1 === valeur2) {
        setPairesReussies((temps) => [...temps, valeur1]);
        setCartesRetournees([]);
      } else {
        setestRetournee(true);
        setTimeout(() => {
          setCartesRetournees([]);
          setestRetournee(false);
        }, 1000);
      }
    }
  }

  const Chrono = (tempsEnSecondes) => {
    const minutes = Math.floor(tempsEnSecondes / 60);
    const secondes = tempsEnSecondes % 60;
    return `${minutes}:${secondes < 10 ? "0" : ""}${secondes}`;
  };

  return (
    <div className="jeu-container">
      <div className="header">
        <div className="infos-joueur">
          <span className="pseudo">{pseudo}</span>
          <br></br>
          <span className="temps">Temps restant : {Chrono(tempsRestant)}</span>
          <br></br>
          <span className="score">
            Paires trouvées : {pairesReussies.length}/6
          </span>
        </div>

        <div className="status">
          {pairesReussies.length === 6 ? (
            <div className="victoire">
              Félicitations {pseudo} ! Vous avez gagné !
            </div>
          ) : partieTerminee ? (
            <div className="defaite">Perdu le temps est écoulé</div>
          ) : (
            ""
          )}
        </div>

        <div className="actions">
          <button className="bouton-reinitialiser" onClick={reinitialiserJeu}>
            Nouvelle partie
          </button>
          <button className="bouton-retour" onClick={onRetour}>
            Retour
          </button>
        </div>
      </div>

      <div className="grille">
        {cartes.map((carte, index) => (
          <Carte
            key={carte.id}
            valeur={carte.valeur}
            estRetourne={
              cartesRetournees.includes(index) ||
              pairesReussies.includes(carte.valeur)
            }
            onCarteClick={() => handleClick(index)}
            disabled={estRetournee || partieTerminee}
          />
        ))}
      </div>
    </div>
  );
}

function Carte({ valeur, estRetourne, onCarteClick, disabled }) {
  const carteImages = [image0, image1, image2, image3, image4, image5];

  return (
    <div
      className={`carte ${estRetourne ? "retournee" : ""}`}
      onClick={!disabled ? onCarteClick : undefined}
    >
      <div className="carte-inner">
        <div className="carte-face carte-dos">
          <img src={dosImage} alt="Dos de carte" />
        </div>
        <div className="carte-face carte-avant">
          <img src={carteImages[valeur]} alt={`Carte ${valeur}`} />
        </div>
      </div>
    </div>
  );
}
