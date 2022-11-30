import {
  property,
  subclass
} from "@arcgis/core/core/accessorSupport/decorators";
import ConfigurationSettingsBase from "templates-common-library/baseClasses/configurationSettingsBase";

@subclass("app.ConfigurationSettings")
class ConfigurationSettings extends ConfigurationSettingsBase {
  constructor(props) {
    super(props);
  }

  @property()
  webmap: string;

  @property()
  mapA11yDesc: string;
}

export default ConfigurationSettings;
