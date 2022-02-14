import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-grafica3',
  templateUrl: './grafica3.component.html',
  styleUrls: ['./grafica3.component.css']
})
export class Grafica3Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // AIzaSyAYN-jmRSHPR78rT0l1na0XchXlJT7_sDw
    this.initMap();
  }


  initMap(): void {
    let map!: any
    let geocoder!: any
    let infowindow!: any
    // const map = new google.maps.Map(
    //   document.getElementById("map") as HTMLElement,
    //   {
    //     zoom: 8,
    //     center: { lat: 40.731, lng: -73.997 },
    //   }
    // );
    let loader = new Loader({
      // apiKey: 'AIzaSyAYN-jmRSHPR78rT0l1na0XchXlJT7_sDw'
      apiKey: ''
    });

    loader.load().then(() => {
        map = new google.maps.Map(document.getElementById("map")!, {
          center: { lat: 40.731, lng: -73.997 },
          disableDefaultUI: true,
          zoomControl: true,
          zoom: 15,
          styles: [
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            }
          ]
        });
    })

     geocoder = new google.maps.Geocoder();
     infowindow = new google.maps.InfoWindow();
  
    (document.getElementById("submit") as HTMLElement).addEventListener(
      "click",
      () => {
        this.geocodeLatLng(geocoder, map, infowindow);
      }
    );
  }
  
  geocodeLatLng(geocoder: any, map: any, infowindow: any) {
    let input = (document.getElementById("latlng") as HTMLInputElement).value;
    let latlngStr = input.split(",", 2);
    let latlng = {
      lat: parseFloat(latlngStr[0]),
      lng: parseFloat(latlngStr[1]),
    };

    console.log(latlng)
  
    geocoder
      .geocode({ location: latlng })
      .then((response: any) => {
        if (response.results[0]) {
          map.setZoom(11);
  
          const marker = new google.maps.Marker({
            position: latlng,
            map: map,
          });
  
          infowindow.setContent(response.results[0].formatted_address);
          infowindow.open(map, marker);
        } else {
          window.alert("No results found");
        }
      })
      .catch((e: any) => window.alert("Geocoder failed due to: " + e));
  }


}
