import axios from "axios";

const API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY; 
const BASE_URL = "https://content.guardianapis.com";

export const fetchGuardian = async () => {
  try {
    const [newsRes, blogRes] = await Promise.all([
      axios.get(`${BASE_URL}/search`, {
        params: {
          "api-key": API_KEY,
          "show-fields": "byline,thumbnail",
          section: "news",
          pageSize: 50,
        },
      }),
      axios.get(`${BASE_URL}/search`, {
        params: {
          "api-key": API_KEY,
          "show-fields": "byline,thumbnail",
          section: "commentisfree",
          pageSize: 50,
        },
      }),
    ]);

    const mapArticle = (item, type) => ({
      id: item.id,
      title: item.webTitle,
      url: item.webUrl,
      thumbnail: item.fields?.thumbnail,
      author: item.fields?.byline || "Unknown",
      publishedAt: item.webPublicationDate,
      type, 
    });

    const news = newsRes.data.response.results.map((item) =>
      mapArticle(item, "news")
    );
    const blogs = blogRes.data.response.results.map((item) =>
      mapArticle(item, "blog")
    );

    return [...news, ...blogs];
  } catch (error) {
    console.error("Guardian API fetch failed:", error);
    return [];
  }
};
