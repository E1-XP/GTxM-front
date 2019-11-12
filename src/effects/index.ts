import "whatwg-fetch";
const vibrant: any = require("node-vibrant");

import { container, types, Model } from "project-f";

import { ImageData, State } from "./../store";

import config from "./../config";
const { API_URL: URL } = config;

interface Response {
  images: ImageData[];
}

export interface ImgLikesData {
  [key: string]: boolean[];
}

export const getImages = (part: number) =>
  fetch(`${URL}/static/img/${part}`)
    .then((resp: any) => resp.json())
    .then(({ images }: Response) => {
      const model = container.get<Model>(types.Model);
      const extractedColors: any[] = [];

      let counter = 0;

      images
        .sort((a, b) => a.id - b.id)
        .map((image, i) => {
          const img = new Image();

          const handleLoad = () => {
            vibrant
              .from(img.src)
              .getPalette()
              .then((result: any) => {
                extractedColors[i] = result;

                counter += 1;
                const loadStatus = Math.floor((counter / images.length) * 100);

                if (loadStatus === 100) {
                  model.setState({
                    images,
                    extractedColors,
                    isLoading: false,
                    loadStatus: 0
                  });

                  return;
                }

                model.setState({ loadStatus });
              });
          };

          img.addEventListener("load", handleLoad);

          img.src = `${URL}/${image.dir}`;
        });
    });

export const getMenuImages = () => {
  const model = container.get<Model>(types.Model);
  const baseURL = `${config.API_URL}/static/img`;

  const menuImages = [
    `${baseURL}/1/kr048.jpg`,
    `${baseURL}/2/bt52Mo.jpg`,
    `${baseURL}/3/917v2c222.jpg`,
    `${baseURL}/4/S1PP2.jpg`
  ];

  menuImages.forEach(url => {
    const image = new Image();
    image.src = url;
  });

  model.setState<State>({ menuImages });
};

export const addLike = (part: number, currentImage: number) =>
  fetch(`${URL}/likes/new/${part}/${currentImage}/`, {
    method: "POST"
  })
    .then((resp: any) => resp.json())
    .then((data: any) => {
      const model = container.get<Model>(types.Model);
      const { images } = model.getState();

      const updatedImages = images.slice();
      updatedImages[currentImage].likes = data.likes;

      const uData = localStorage.getItem("data");
      if (uData) {
        const parsedData: ImgLikesData = JSON.parse(uData);

        parsedData[part][currentImage] = true;
        localStorage.setItem("data", JSON.stringify(parsedData));
      }

      model.setState({ images: updatedImages });
    });

export const populateLocalStorage = () => {
  const alreadyExist = localStorage.getItem("data");
  if (alreadyExist) return;

  const uData: ImgLikesData = {};

  Array(4)
    .fill(null)
    .map((_, i) => {
      uData[i + 1] = Array(27)
        .fill(null)
        .map((_, i) => false);
    });

  localStorage.setItem("data", JSON.stringify(uData));

  return uData;
};
