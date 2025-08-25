# Location Picker Setup Guide

This guide explains how the location picker works with reverse geocoding functionality using OpenStreetMap.

## How It Works

The location picker automatically:

1. Performs reverse geocoding when a user selects a location on the map using OpenStreetMap's Nominatim service
2. Updates the address and city fields in the form with the geocoded information
3. Works without any API keys or additional setup (uses open-source services)

## Implementation Details

The component uses:

- `leaflet-geosearch` with `OpenStreetMapProvider` for forward geocoding (search)
- The same provider for reverse geocoding (coordinate to address conversion)
- OpenStreetMap's Nominatim service for geocoding operations

## Fallback Behavior

If the geocoding request fails for any reason, the component will still:

1. Update the latitude and longitude coordinates
2. Leave the address and city fields unchanged (user can still enter manually)

This ensures the feature works reliably in all environments.
