export interface Country {
    cca3?: string;
    name: {
      common: string;
      official: string;
    };
    capital?: string[];
    area: number;
    languages: { [key: string]: string };
    flags: { png: string; svg: string };
}
  
export interface Weather {
    main: {
        temp: number;
    };
    wind: {
        speed: number;
    };
    weather: {
        icon: string;
        description: string;
    }[];
}


  
