/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLocation = /* GraphQL */ `
  mutation CreateLocation(
    $input: CreateLocationInput!
    $condition: ModellocationConditionInput
  ) {
    createLocation(input: $input, condition: $condition) {
      id
      name
      lat
      long
      color
      createdAt
      updatedAt
    }
  }
`;
export const updateLocation = /* GraphQL */ `
  mutation UpdateLocation(
    $input: UpdateLocationInput!
    $condition: ModellocationConditionInput
  ) {
    updateLocation(input: $input, condition: $condition) {
      id
      name
      lat
      long
      color
      createdAt
      updatedAt
    }
  }
`;
export const deleteLocation = /* GraphQL */ `
  mutation DeleteLocation(
    $input: DeleteLocationInput!
    $condition: ModellocationConditionInput
  ) {
    deleteLocation(input: $input, condition: $condition) {
      id
      name
      lat
      long
      color
      createdAt
      updatedAt
    }
  }
`;
