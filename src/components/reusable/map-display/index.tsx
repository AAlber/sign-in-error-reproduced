import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";
import Geocode from "react-geocode";
import Skeleton from "../../skeleton";
import Spinner from "../../spinner";
import Box from "../box";
import { styles } from "./data";

type MapProps = {
  address: string;
  height?: string;
};

const Map = (props: MapProps) => {
  const apiKey = "AIzaSyBOf810Thg7sKyq5AKDPKRqwzdQQRhZ2J0";

  const [coordinates, setCoordinates] = useState({
    center: {
      lat: 28.7040592,
      lng: 76.34222412,
    },
    zoom: 15,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleApiLoaded = (map, maps) => {
    const marker = new maps.Marker({
      position: { lat: coordinates.center.lat, lng: coordinates.center.lng },
      icon: {
        url: "/images/circle.svg",
        scaledSize: new (window as any).google.maps.Size(10, 10),
      },
      map,
    });
    return marker;
  };

  useEffect(() => {
    setLoading(true);
    Geocode.setApiKey(apiKey);
    Geocode.fromAddress(props.address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setCoordinates({
          center: {
            lat: lat,
            lng: lng,
          },
          zoom: 15,
        });
        setError(false);
        setLoading(false);
      },
      (error) => {
        setError(true);
        console.error(error);
      },
    );
  }, [props.address]);

  useEffect(() => {
    setMapLoaded(false);
    setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    console.log(props.address);
  }, [props.address]);

  if (error) return null;
  if (loading)
    return (
      <div className="h-52 w-full">
        <Skeleton />
      </div>
    );

  return (
    <Box noPadding>
      <div className="relative h-full w-full">
        <div
          style={{ height: props.height ? props.height : "300px" }}
          className={`absolute left-0 top-0 z-20 flex w-full items-center justify-center rounded-md bg-foreground ${
            mapLoaded === false
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <Spinner />
        </div>
      </div>
      <div
        style={{ height: props.height ? props.height : "300px" }}
        className={`relative hidden w-full justify-center self-center overflow-hidden rounded-md bg-background dark:flex`}
      >
        <GoogleMapReact
          options={{
            backgroundColor: "none",
            disableDefaultUI: true,
            gestureHandling: "greedy",
            styles: styles,
          }}
          google={(window as any).google}
          bootstrapURLKeys={{ key: apiKey }}
          defaultCenter={{
            lat: coordinates.center.lat + 0.0008,
            lng: coordinates.center.lng,
          }}
          defaultZoom={coordinates.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        />
      </div>

      <div
        style={{ height: props.height ? props.height : "300px" }}
        className={`relative flex w-full justify-center self-center overflow-hidden rounded-md dark:hidden`}
      >
        <div className="absolute h-full w-full">
          <div
            className={`absolute left-0 top-0 z-20 flex h-52 w-full max-w-[524px] items-center justify-center rounded-md bg-background ${
              mapLoaded === false
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <Spinner />
          </div>
        </div>
        <GoogleMapReact
          options={{
            backgroundColor: "none",
            disableDefaultUI: true,
            gestureHandling: "greedy",
            styles: [
              {
                featureType: "poi",
                elementType: "labels.icon",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
            ],
          }}
          google={(window as any).google}
          bootstrapURLKeys={{ key: apiKey }}
          defaultCenter={{
            lat: coordinates.center.lat + 0.0008,
            lng: coordinates.center.lng,
          }}
          defaultZoom={coordinates.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        />
      </div>
    </Box>
  );
};

export default Map;
