import React, { Component, Fragment} from 'react';
import PropTypes from 'prop-types';

// Constante globale
const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

// Fonction utile
const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

class Pagination extends Component {

  // Props = constructor
  constructor(props) {
    super(props);
    const { totalRecords = null, pageLimit = 30, pageNeighbours = 0 } = props;

    // NUMBER On définit la limite de pays par page => Traitement basique
    this.pageLimit = typeof pageLimit === "number" ? pageLimit : 30;

    // NUMBER Nombre de pays total => Traitement basique
    this.totalRecords = typeof totalRecords === "number" ? totalRecords : 0;

    // NUMBER Nombre de lien disponible en dehors de la page active => Traitement basique
    this.pageNeighbours =
      typeof pageNeighbours === "number"
        ? Math.max(0, Math.min(pageNeighbours, 2))
        : 0;

    // NUMBER Total des pages => Traitement basique
    this.totalPages = Math.ceil(this.totalRecords / this.pageLimit); // => Pays par page

    // On initialise la page courante => Initialisation
    this.state = { currentPage: 1 };
  }

  componentDidMount() {
    this.gotoPage(1);
  }

  // Méthode de type Evt => Changement d'état
  gotoPage = page => {
    const { onPageChanged = f => f } = this.props;

    // NUMBER => Traitement basique
    const currentPage = Math.max(0, Math.min(page, this.totalPages));

    // ETAT
    const paginationData = {
      currentPage,
      totalPages: this.totalPages,
      pageLimit: this.pageLimit,
      totalRecords: this.totalRecords
    };
    // Fonction procédurale
    this.setState({ currentPage }, () => onPageChanged(paginationData));
  };

  // Méthode de type Evt => Changement d'état
  handleClick = (page, evt) => {
    evt.preventDefault();
    this.gotoPage(page);
  };

  // Méthode de type Evt => Changement d'état
  handleMoveLeft = evt => {
    evt.preventDefault();
    this.gotoPage(this.state.currentPage - this.pageNeighbours * 2 - 1);
  };

  // Méthode de type Evt => Changement d'état
  handleMoveRight = evt => {
    evt.preventDefault();
    this.gotoPage(this.state.currentPage + this.pageNeighbours * 2 + 1);
  };

  // Méthode Centrale => Coeur de l'application
  fetchPageNumbers = () => {
    const totalPages = this.totalPages; //=> Nbre totale de page (14)
    const currentPage = this.state.currentPage; //=> Numéro Page en cours
    const pageNeighbours = this.pageNeighbours; //=> Nbre Pages voisines affichées d'un coté (1)

    // NUMBER Nombre de liens de page => Traitement basique
    const totalNumbers = this.pageNeighbours * 2 + 3; // => Nbr total de page (5)

    // NUMBER Nombre de liens avec suivant et précédent => Traitement basique
    const totalBlocks = totalNumbers + 2; // => Nbr total de liens de nav. (7)

    // On rentre dans l'application => On a besoin d'afficher une pagination particuliére avec des signets
    if (totalPages > totalBlocks) {
      let pages = []; // La méthode coeur renvoie un tableau

      // NUMBER => Traitement basique
      const leftBound = currentPage - pageNeighbours; //=> Numéro de la page précédente

      // NUMBER => Traitement basique
      const rightBound = currentPage + pageNeighbours; //=> Numéro de la page suivante

      // NUMBER => Traitement basique
      const beforeLastPage = totalPages - 1; //=> Numéro avant derniére page

      // NUMBER => Condition légére renvoyant une valeur
      const startPage = leftBound > 2 ? leftBound : 2;
      //=> Numéro de la page précédente au dela de 2

      // NUMBER => Condition légére renvoyant une valeur
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;
      //=> Numéro de la page suivant avant l'avant derniére page

      // ARRAY => Données retournées (constante)
      pages = range(startPage, endPage);
      //=> Page précédente, page courante et page suivante si possible entre la 2eme et l'avant derniere page

      // NUMBER => Traitement basique
      const pagesCount = pages.length; //=> Nbre de pages dans la rangée siuvant la position de la page courante

      // NUMBER => Traitement basique
      const singleSpillOffset = totalNumbers - pagesCount - 1; //=> Position du signet par rapport à la page courante

      // BOOL => Condition légére
      const leftSpill = startPage > 2; //=> On a dépassé la deuxiéme page

      // BOOL => Condition légére
      const rightSpill = endPage < beforeLastPage; //=> On est avant l'avant derniére page

      // STRING => Pas de traitement
      const leftSpillPage = LEFT_PAGE;
      const rightSpillPage = RIGHT_PAGE;

      // TESTS CENTRAUX
      if (leftSpill && !rightSpill) { //=> On a dépassé la deuxiéme page et On a dépassé l'avant derniére page

        // ARRAY => Traitement basique
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        //=> Les trois pages en plus de la page courante et de sa page précédente

        // ARRAY => Données retournées (constante)
        pages = [leftSpillPage, ...extraPages, ...pages];
        //=> Le signet "précédent" + Les trois pages en plus de la page courante et de sa page précédente + la page précédante

      } else if (!leftSpill && rightSpill) { //=> On a PAS dépassé la deuxiéme page ET On est avant l'avant derniére page

        // ARRAY => Traitement basique
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
         //=> Les trois page en plus de la page courante et de sa page suivante

        // ARRAY => Données retournées (constante)
        pages = [...pages, ...extraPages, rightSpillPage];

      } else if (leftSpill && rightSpill) { //=> On a dépassé la deuxiéme page et On est avant l'avant derniére page

        // ARRAY => Données retournées (constante)
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }

      // ARRAY => Données retournées (constante)
      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  render() {
    // Logique de rendu
    if (!this.totalRecords) return null;
    // Logique de rendu
    if (this.totalPages === 1) return null;

    // STATE
    const { currentPage } = this.state;

    // MAP => Coeur de l'appli
    const pages = this.fetchPageNumbers();

    return (
      <Fragment>
        <nav aria-label="Countries Pagination">
          <ul className="pagination">
            {pages.map((page, index) => {
              // Logique de rendu
              if (page === LEFT_PAGE)
                return (
                  <li key={index} className="page-item">
                    <a
                      className="page-link"
                      href=""
                      aria-label="Previous"
                      onClick={this.handleMoveLeft}
                    >
                      <span aria-hidden="true">&laquo;</span>
                      <span className="sr-only">Previous</span>
                    </a>
                  </li>
                );
              // Logique de rendu
              if (page === RIGHT_PAGE)
                return (
                  <li key={index} className="page-item">
                    <a
                      className="page-link"
                      href=""
                      aria-label="Next"
                      onClick={this.handleMoveRight}
                    >
                      <span aria-hidden="true">&raquo;</span>
                      <span className="sr-only">Next</span>
                    </a>
                  </li>
                );

              return (
                <li
                  key={index}
                  className={`page-item${
                    currentPage === page ? " active" : ""
                  }`}
                >
                  <a
                    className="page-link"
                    href=""
                    onClick={e => this.handleClick(page, e)}
                  >
                    {page}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Fragment>
    );
  }
}

Pagination.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  pageLimit: PropTypes.number,
  pageNeighbours: PropTypes.number,
  onPageChanged: PropTypes.func
};

export default Pagination;
