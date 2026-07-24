/* eslint-disable obsidianmd/no-unsupported-api -- Declarative definitions are retained for Obsidian 1.13+; display() adapts them for older hosts. */
import { App, PluginSettingTab, Setting } from "obsidian";
import type { SettingDefinitionItem } from "obsidian";
import type MotesPlugin from "./main";
import { t } from "./i18n";

export class MotesSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: MotesPlugin) {
    super(app, plugin);
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    switch (key) {
      case "folder":
        this.plugin.settings.folder = String(value).trim() || "Motes";
        await this.plugin.saveSettings();
        await this.plugin.store.reloadAll();
        return;
      case "attachmentFolder":
        this.plugin.settings.attachmentFolder = String(value).trim() || "Motes/attachments";
        break;
      case "showSidebarTags":
      case "showSidebarYears":
      case "dailyGoal":
      case "density":
      case "enableMoodColoring":
      case "defaultOverviewMode":
      case "mobileInputStyle":
      case "waterfallLayout":
      case "editorMode":
        this.setValue(key, value);
        await this.plugin.saveSettings();
        this.plugin.store.notifyChange();
        return;
      case "language": {
        this.setValue(key, value);
        await this.plugin.saveSettings();
        const update = (this as unknown as { update?: () => void }).update;
        if (update) {
          update.call(this);
        } else {
          this.display();
        }
        return;
      }
      case "collapseLineLimit":
        this.setValue(key, Number(value) || 0);
        await this.plugin.saveSettings();
        this.plugin.store.notifyChange();
        return;
      case "trashMaxItems":
        this.setValue(key, Number(value) || 0);
        break;
      case "brandName":
        this.plugin.settings.brandName = String(value).trim();
        await this.plugin.saveSettings();
        this.plugin.store.notifyChange();
        return;
      default:
        this.setValue(key, value);
    }
    await this.plugin.saveSettings();
  }

  getControlValue(key: string): unknown {
    return (this.plugin.settings as Record<string, unknown>)[key];
  }

  display(): void {
    this.containerEl.empty();
    this.renderLegacyDefinitions(this.getSettingDefinitions());
  }

  getSettingDefinitions(): SettingDefinitionItem[] {
    return [
      this.text("settings.folder", "folder", "Motes"),
      this.text("settings.attachFolder", "attachmentFolder", "Motes/attachments"),
      this.toggle("settings.sidebarTags", "showSidebarTags"),
      this.toggle("settings.sidebarYears", "showSidebarYears"),
      this.toggle("settings.clearAfterSave", "clearAfterSave"),
      this.slider("settings.pageSize", "pageSize", 10, 200, 10),
      this.toggle("settings.useTrash", "useTrash"),
      this.dropdown("settings.trashMax", "trashMaxItems", {
        "100": t("settings.trash.100"), "300": t("settings.trash.300"),
        "500": t("settings.trash.500"), "1000": t("settings.trash.1000"),
        "3000": t("settings.trash.3000"), "0": t("settings.trash.0"),
      }),
      this.dropdown("settings.exportTheme", "exportTheme", {
        auto: t("settings.exportTheme.auto"), random: t("settings.exportTheme.random"),
        paper: t("settings.exportTheme.paper"), kraft: t("settings.exportTheme.kraft"),
        mint: t("settings.exportTheme.mint"), peach: t("settings.exportTheme.peach"),
        sky: t("settings.exportTheme.sky"), lavender: t("settings.exportTheme.lavender"),
        midnight: t("settings.exportTheme.midnight"), charcoal: t("settings.exportTheme.charcoal"),
      }),
      this.dropdown("settings.collapse", "collapseLineLimit", {
        "0": t("settings.collapse.0"), "4": t("settings.collapse.4"),
        "6": t("settings.collapse.6"), "8": t("settings.collapse.8"),
        "12": t("settings.collapse.12"), "20": t("settings.collapse.20"),
      }),
      this.slider("settings.dailyGoal", "dailyGoal", 1, 30, 1),
      this.dropdown("settings.defaultOverview", "defaultOverviewMode", {
        heatmap: t("settings.defaultOverview.heatmap"),
        calendar: t("settings.defaultOverview.calendar"),
        buddy: t("settings.defaultOverview.buddy"),
      }),
      {
        type: "group",
        heading: t("settings.heading.newFeatures"),
        items: [
          this.dropdown("settings.density", "density", {
            cozy: t("settings.density.cozy"), compact: t("settings.density.compact"),
          }),
          this.toggle("settings.vim", "enableVimKeys"),
          this.toggle("settings.mood", "enableMoodColoring"),
          this.toggle("settings.smartReview", "enableSmartReview"),
          this.dropdown("settings.language", "language", {
            auto: t("settings.language.auto"), "zh-CN": t("settings.language.zh"),
            "en-US": t("settings.language.en"),
          }),
          this.dropdown("settings.sendHotkey", "sendHotkey", {
            enter: t("settings.sendHotkey.enter"), "ctrl-enter": t("settings.sendHotkey.ctrlEnter"),
          }),
          this.dropdown("settings.mobileInputStyle", "mobileInputStyle", {
            fab: t("settings.mobileInputStyle.fab"),
            "always-visible": t("settings.mobileInputStyle.alwaysVisible"),
          }),
          this.dropdown("settings.storageMode", "storageMode", {
            daily: t("settings.storageMode.daily"), yearly: t("settings.storageMode.yearly"),
          }),
          this.toggle("settings.waterfall", "waterfallLayout"),
          this.dropdown("settings.editorMode", "editorMode", {
            native: t("settings.editorMode.native"), tiptap: t("settings.editorMode.tiptap"),
            textarea: t("settings.editorMode.textarea"),
          }),
          this.slider("settings.editorHeight", "editorHeight", 60, 600, 20),
          this.text("settings.brandName", "brandName", "Motes"),
        ],
      },
      {
        type: "group",
        heading: t("settings.heading.about"),
        items: [
          {
            name: t("settings.repo.name"),
            desc: t("settings.repo.desc"),
            action: () => window.open("https://github.com/hencter/obsidian-Motes", "_blank"),
          },
          {
            name: t("settings.version", { ver: this.plugin.manifest.version }),
            desc: "## yyyy-MM-dd + - HH:MM",
          },
        ],
      },
    ];
  }

  private toggle(nameKey: string, key: string): SettingDefinitionItem {
    return { name: t(`${nameKey}.name`), desc: this.description(nameKey), control: { type: "toggle", key } };
  }

  private text(nameKey: string, key: string, placeholder: string): SettingDefinitionItem {
    return { name: t(`${nameKey}.name`), desc: this.description(nameKey), control: { type: "text", key, placeholder } };
  }

  private slider(nameKey: string, key: string, min: number, max: number, step: number): SettingDefinitionItem {
    return { name: t(`${nameKey}.name`), desc: this.description(nameKey), control: { type: "slider", key, min, max, step } };
  }

  private dropdown(nameKey: string, key: string, options: Record<string, string>): SettingDefinitionItem {
    return { name: t(`${nameKey}.name`), desc: this.description(nameKey), control: { type: "dropdown", key, options } };
  }

  private description(nameKey: string): string | undefined {
    const key = `${nameKey}.desc`;
    const value = t(key);
    return value === key ? undefined : value;
  }

  private renderLegacyDefinitions(items: SettingDefinitionItem[]): void {
    for (const item of items) {
      if ("type" in item && (item.type === "group" || item.type === "list")) {
        if (item.heading) {
          new Setting(this.containerEl).setName(item.heading).setHeading();
        }
        this.renderLegacyDefinitions(item.items ?? []);
        continue;
      }

      const name = String(item.name);
      const setting = new Setting(this.containerEl).setName(name);
      const description = typeof item.desc === "string" ? String(item.desc) : undefined;
      if (description) {
        setting.setDesc(description);
      }

      if ("action" in item) {
        setting.addButton((button) => button
          .setButtonText(name)
          .onClick(() => item.action(setting.settingEl, 0)));
        continue;
      }

      if (!("control" in item)) {
        continue;
      }

      const control = item.control as {
        type: "toggle" | "text" | "dropdown" | "slider";
        key: string;
        placeholder?: string;
        options?: Record<string, string>;
        min?: number;
        max?: number;
        step?: number;
      };
      const value = this.getControlValue(control.key);
      switch (control.type) {
        case "toggle":
          setting.addToggle((toggle) => toggle
            .setValue(Boolean(value))
            .onChange((nextValue) => void this.setControlValue(control.key, nextValue)));
          break;
        case "text":
          setting.addText((text) => text
            .setPlaceholder(control.placeholder ?? "")
            .setValue(typeof value === "string" ? value : "")
            .onChange((nextValue) => void this.setControlValue(control.key, nextValue)));
          break;
        case "dropdown":
          setting.addDropdown((dropdown) => dropdown
            .addOptions(control.options ?? {})
            .setValue(typeof value === "string" ? value : "")
            .onChange((nextValue) => void this.setControlValue(control.key, nextValue)));
          break;
        case "slider":
          setting.addSlider((slider) => slider
            .setLimits(control.min ?? 0, control.max ?? 100, control.step ?? 1)
            .setValue(typeof value === "number" ? value : 0)
            .onChange((nextValue) => void this.setControlValue(control.key, nextValue)));
          break;
      }
    }
  }

  private setValue(key: string, value: unknown): void {
    const settings = this.plugin.settings as Record<string, unknown>;
    settings[key] = value;
  }
}
