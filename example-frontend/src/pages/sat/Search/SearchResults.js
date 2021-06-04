import React from 'react';

const MaxSearchResults = 20;

const filterResults = (stations, searchText) => {
    if (!stations) return null;
    if (!searchText || searchText === '') return null;
    if (searchText === 'manned == True' ) {
        const regex = new RegExp('zarya', 'i');
        return stations.filter(station => regex.test(station.name)).slice(0, MaxSearchResults);
    };
    const regex = new RegExp(searchText, 'i');
    return stations.filter(station => regex.test(station.name)).slice(0, MaxSearchResults);
}

    
const SearchResults = ({stations, searchText, onResultClick}) => {
    console.log('searchText: ', searchText)
    console.log('stations: ', stations)
    const results = filterResults(stations, searchText);
    if (!results) return null;

    return (
        <div className='ResultsWrapper'>
            {results.map((result, i) => <StationCard key={result.name + i} station={result} onClick={onResultClick} />)}
        </div>
    )
}


export const StationCard = ({station, onClick, onRemoveClick, className}) => {

    const noradId = station.satrec && station.satrec.satnum;
    
    return (
        <div className={'Result ' + (className || '')} onClick={e => onClick && onClick(station)}>
            <p>
                <span title={noradId ? 'NORAD ID: ' + noradId : null}>{station.name}</span>
                {onRemoveClick && <span className='RemoveButton' onClick={e => onRemoveClick(station)}>x</span>}
            </p>
        </div>
    )
}


export default SearchResults;