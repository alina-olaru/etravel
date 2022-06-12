import { CloudVisionApiResponse } from './models/cloudVisionApiResponse';

export const hardcodedCloudVisionApiResponse: CloudVisionApiResponse ={
  responses: [
    {
      landmarkAnnotations: [
        {
          mid: "/g/11dyj4lx1",
          description: "Plaza de Gaudí",
          score: 0.7021668,
          boundingPoly: {
            vertices: [
              {
                x: 113,
                y: 141
              },
              {
                x: 330,
                y: 141
              },
              {
                x: 330,
                y: 282
              },
              {
                x: 113,
                y: 282
              }
            ]
          },
          locations: [
            {
              latLng: {
                latitude: 41.404622499999995,
                longitude: 2.1757736999999997
              }
            }
          ],
          latLongMap: {
            lat: 41.404622499999995,
            lng: 2.1757736999999997
          }
        },
        {
          mid: "/m/0g6n3",
          description: "La Sagrada Familia",
          score: 0.6681025,
          boundingPoly: {
            vertices: [
              {
                x: 42,
                y: 98
              },
              {
                x: 330,
                y: 98
              },
              {
                x: 330,
                y: 429
              },
              {
                x: 42,
                y: 429
              }
            ]
          },
          locations: [
            {
              latLng: {
                latitude: 41.4036299,
                longitude: 2.1743558
              }
            }
          ],
          latLongMap: {
            lat: 41.4036299,
            lng: 2.1743558
          }
        },
        {
          mid: "/m/0g6n3",
          description: "Sagrada Familia ('Expiatory Temple of the Holy Family')",
          score: 0.6052463,
          boundingPoly: {
            vertices: [
              {
                x: 92,
                y: 135
              },
              {
                x: 330,
                y: 135
              },
              {
                x: 330,
                y: 429
              },
              {
                x: 92,
                y: 429
              }
            ]
          },
          locations: [
            {
              latLng: {
                latitude: 41.403579,
                longitude: 2.174242
              }
            }
          ],
          latLongMap: {
            lat: 41.403579,
            lng: 2.174242
          }
        }
      ]
    }
  ]
};
