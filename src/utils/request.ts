const base_url = "https://itemshub-api.sidcloud.cn/";

const router = {
  index: base_url + "index",
  skin: {
    lts: base_url + "skin/lts",
  },
  market: {
    lts: base_url + "market/lts",
  },
  case: base_url + "case",
};
const request = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
};

const api_index = async () => request(router.index);

const api_case = async () => request(router.case);

export { api_index, api_case };
