import React, { Component } from 'react';
import SearchResults from './SearchResults';
import SearchBox from './SearchBox';
import {
    Card as MuiCard,
    CardContent as MuiCardContent,
    CardHeader,
    IconButton
  } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import styled, { withTheme } from "styled-components";
const Card = styled(MuiCard)(spacing);

class Search extends Component {

    state = { 
        searchText: ''
    }

    handleSearchChanged = (val) => {
        this.setState({searchText: val});
    }

    render() {
        const { stations, onResultClick } = this.props;

        return (
            <Card mb={4}>
                <SearchBox value={this.state.searchText} onChange={this.handleSearchChanged} />
                <SearchResults stations={stations} searchText={this.state.searchText} onResultClick={onResultClick} />
            </Card>
        )
    }
}

export default Search;