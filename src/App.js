import React, { Component } from 'react';
import Countries from "countries-api/lib/data/Countries.json";
import './App.css';

import Pagination from "./Pagination";
import CountryCard from "./CountryCard";

class App extends Component {

  // 1. Tous les countries et les valeurs par défaut des pages sont dans le composant pagination
  state = {
    allCountries: [],
    currentCountries: [],
    currentPage: null,
    totalPages: null
  };

  // 2. On récupére tous les pays
  componentDidMount() {
    const allCountries = Countries;
    this.setState({ allCountries });
  }

  // 3. La page change l'état change
  onPageChanged = data => {
    // La Ressource
    const { allCountries } = this.state;
    // Mise à jour du state pendant l'évévenement
    const { currentPage, totalPages, pageLimit } = data; // Les données vient du composant pagination
    // NUMBER => Traitement basique
    const offset = (currentPage - 1) * pageLimit; // La page en cours - 1 pour partir de 0 multiplié par le nbre de pays par page
    // ARRAY => Traitement basique
    const currentCountries = allCountries.slice(offset, offset + pageLimit); // Récupére la liste des pays de la page en cours
    // Fonction procédurale
    this.setState({ currentPage, currentCountries, totalPages }); // On met à jour l'état des informations
  };

  render() {
    // STATE
    const {
      allCountries, // Nombre total de pays
      currentCountries, // Tableau des pays en cours
      currentPage, // La page en cours pour la pagination
      totalPages // Le nombre total de pages
    } = this.state;

    // NUMBER => Traitement basique
    const totalCountries = allCountries.length;

    // BOOL => Test Basique
    if (totalCountries === 0) return null;

    // ARRAY => Traitement basique
    const headerClass = [
      "text-dark py-2 pr-4 m-0",
      currentPage ? "border-gray border-right" : "" // SI il y a une page courrante on ajoute une bordure
    ]
      .join(" ")
      .trim();

    return (
      <div className="container mb-5">
        <div className="row d-flex flex-row py-5">
          <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <h2 className={headerClass}>
                <strong className="text-secondary">{totalCountries}</strong>{" "}
                Countries
              </h2>
              {currentPage  && (
                <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                  Page <span className="font-weight-bold">{currentPage}</span> /{" "}
                  <span className="font-weight-bold">{totalPages}</span>
                </span>
              )}
            </div>
            <div className="d-flex flex-row py-4 align-items-center">
              <Pagination
                totalRecords={totalCountries}
                pageLimit={18}
                pageNeighbours={1}
                onPageChanged={this.onPageChanged}
              />
            </div>
          </div>
          {currentCountries.map(country => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
