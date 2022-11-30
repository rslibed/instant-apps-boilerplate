// @arcgis/core
import MapView from "@arcgis/core/views/MapView";
import PortalItem from "@arcgis/core/portal/PortalItem";
import { whenOnce } from "@arcgis/core/core/reactiveUtils";

// templates-common-library
import ApplicationBase from "templates-common-library/baseClasses/ApplicationBase";
import { createMapFromItem } from "templates-common-library/baseClasses/support/itemUtils";
import { setPageTitle } from "templates-common-library/baseClasses/support/domHelper";

// TODO: Update instant-apps-components to auto define components (config.autoDefineCustomElements): https://stenciljs.com/docs/custom-elements
// Use this pattern for now:
import { InstantAppsHeader } from "@esri/instant-apps-components/dist/components/instant-apps-header";
import { InstantAppsSocialShare } from "@esri/instant-apps-components/dist/components/instant-apps-social-share";
import ConfigurationSettings from "./app/ConfigurationSettings/ConfigurationSettings";
customElements.define("instant-apps-header", InstantAppsHeader);
customElements.define("instant-apps-social-share", InstantAppsSocialShare);

export default class App {
  private _configurationSettings: ConfigurationSettings;

  async init(base: ApplicationBase): Promise<void> {
    const config = this._getConfig(base);

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const urlMapId = urlParams.has("webmap")
      ? urlParams.get("webmap")
      : urlParams.has("webscene")
      ? urlParams.get("webscene")
      : null;

    let item: PortalItem | null = null;

    if (urlMapId) {
      item = await new PortalItem({
        portal: base.portal,
        id: urlMapId
      }).load();
    } else {
      const { webMapItems, webSceneItems } = base.results;

      if (config.type === "webmap") {
        item = webMapItems?.[0]?.value as PortalItem;
      }
      if (config.type === "webscene") {
        item = webSceneItems?.[0]?.value as PortalItem;
      }

      if (!item) {
        if (config.webmap !== "default") {
          item = await new PortalItem({
            portal: base.portal,
            id: config.webmap
          }).load();
        } else if (config.webscene !== "default") {
          item = await new PortalItem({
            portal: base.portal,
            id: config.webscene
          }).load();
        }
      }
    }

    const appItemTitle = base?.results?.applicationItem?.value?.title;
    config.title = config?.title
      ? config.title
      : appItemTitle
      ? appItemTitle
      : item?.title
      ? item.title
      : "";

    setPageTitle(config.title);

    const appProxies = base.results?.applicationItem?.value?.applicationProxies;

    this._configurationSettings = this._initConfigurationSettings(config);

    console.log("CONFIGURATION SETTINGS: ", this._configurationSettings);

    try {
      const map = await createMapFromItem({
        item: item as PortalItem,
        appProxies
      });

      const root = document.getElementById("root");

      const viewDiv = document.createElement("div");
      viewDiv.id = "viewDiv";
      root?.appendChild(viewDiv);

      const view = new MapView({
        map,
        container: "viewDiv"
      });

      await whenOnce(() => view?.ready);
      const loader = document.getElementById(
        "loader"
      ) as HTMLCalciteLoaderElement;
      loader.remove();
    } catch (error) {
      console.error("ERROR: ", error);
    }
  }

  private _getConfig(base: ApplicationBase) {
    return window.location !== window.parent.location
      ? { ...base.config, ...base.config.draft }
      : { ...base.config };
  }

  private _initConfigurationSettings(config): ConfigurationSettings {
    return new ConfigurationSettings(config);
  }
}
