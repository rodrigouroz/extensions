import { Action, ActionPanel, Icon, Image, List } from "@raycast/api";
import React, { useState } from "react";
import { ActionToDiceBearAvatars } from "./components/action-to-dice-bear-avatars";
import { AVATAR_URL, avatarStyles, defaultSeed, filterTags, MULTI_AVATAR_URL } from "./utils/constants";
import { avatarInit, AvatarOptions } from "./types/types";
import { isEmpty } from "./utils/common-utils";
import { AvatarImageAction } from "./components/avatar-image-action";
import { createAvatarURL } from "./hooks/hooks";
import Mask = Image.Mask;
import { ActionToMultiAvatar } from "./components/action-to-multi-avatar";

export default function GenerateAvatar() {
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions>(avatarInit);
  const [tag, setTag] = useState<string>("");
  const { diceBearAvatarInfo, multiAvatarInfo, loading } = createAvatarURL(avatarOptions);

  return (
    <List
      isLoading={loading}
      isShowingDetail={true}
      searchBarPlaceholder={"Enter custom seed, don't use sensitive or personal data as seeds"}
      onSearchTextChange={(newValue) => {
        const _avatarOptions = { ...avatarOptions };
        if (isEmpty(newValue)) {
          _avatarOptions.seed = defaultSeed;
        } else {
          _avatarOptions.seed = newValue;
        }
        setAvatarOptions(_avatarOptions);
      }}
      onSelectionChange={(id) => {
        if (typeof id !== "undefined") {
          const _avatarOptions = { ...avatarOptions };
          _avatarOptions.style = id;
          setAvatarOptions(_avatarOptions);
        }
      }}
      enableFiltering={false}
      throttle={true}
      searchBarAccessory={
        <List.Dropdown
          tooltip={"Avatar Sources"}
          storeValue={true}
          onChange={(newValue) => {
            setTag(newValue);
          }}
        >
          {filterTags.map((value) => {
            return <List.Dropdown.Item key={value.value} title={value.title} value={value.value} />;
          })}
        </List.Dropdown>
      }
    >
      {(tag === filterTags[0].value || tag === filterTags[1].value) && (
        <List.Section title={"Multiavatar"}>
          <List.Item
            id={"multiAvatar"}
            icon={{ source: MULTI_AVATAR_URL + "/" + defaultSeed + ".svg", fallback: "avatar-icon.png" }}
            title={"multiavatar"}
            detail={
              <List.Item.Detail
                markdown={multiAvatarInfo.markdownImage}
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.Label title="Title" text={"Multiavatar"} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label title="Designer" text={"Gie Katon"} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label title={"License"} text={"MULTIAVATAR LICENSE v1.0"} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label title="URL" text={multiAvatarInfo.svg} />
                  </List.Item.Detail.Metadata>
                }
              />
            }
            actions={
              <ActionPanel>
                <AvatarImageAction
                  avatarOptions={avatarOptions}
                  setAvatarOptions={setAvatarOptions}
                  avatarInfo={multiAvatarInfo}
                  advancedOptions={false}
                />
                <ActionToMultiAvatar avatarURL={multiAvatarInfo.svg} />
              </ActionPanel>
            }
          />
        </List.Section>
      )}
      {(tag === filterTags[0].value || tag === filterTags[2].value) && (
        <List.Section title={"DiceBear Avatars"}>
          {avatarStyles.map((value) => {
            return (
              <List.Item
                id={value.name}
                key={value.name}
                icon={{
                  source: AVATAR_URL + "/" + value.name + "/" + defaultSeed + ".png",
                  mask: Mask.RoundedRectangle,
                  fallback: "avatar-icon.png",
                }}
                title={{
                  value: value.name,
                  tooltip: `Designer: ${value.designer}, License: ${value.license.name}`,
                }}
                detail={
                  <List.Item.Detail
                    isLoading={isEmpty(diceBearAvatarInfo.png)}
                    markdown={
                      isEmpty(diceBearAvatarInfo.svg)
                        ? " "
                        : `<img src="${diceBearAvatarInfo.png}" alt="" height="190" />`
                    }
                    metadata={
                      <List.Item.Detail.Metadata>
                        <List.Item.Detail.Metadata.Label title="Title" text={value.title} />
                        <List.Item.Detail.Metadata.Separator />
                        <List.Item.Detail.Metadata.Label title="Designer" text={value.designer} />
                        <List.Item.Detail.Metadata.Separator />
                        <List.Item.Detail.Metadata.Label title={"License"} text={value.license.name} />
                        <List.Item.Detail.Metadata.Separator />
                        <List.Item.Detail.Metadata.Label title="URL" text={diceBearAvatarInfo.svg} />
                      </List.Item.Detail.Metadata>
                    }
                  />
                }
                actions={
                  <ActionPanel>
                    <AvatarImageAction
                      avatarOptions={avatarOptions}
                      setAvatarOptions={setAvatarOptions}
                      avatarInfo={diceBearAvatarInfo}
                      advancedOptions={true}
                    />
                    <Action
                      icon={Icon.ArrowClockwise}
                      title={"Reset Options"}
                      shortcut={{ modifiers: ["shift", "cmd"], key: "r" }}
                      onAction={() => {
                        const _avatar = { ...avatarInit };
                        _avatar.style = avatarOptions.style;
                        setAvatarOptions(_avatar);
                      }}
                    />
                    <ActionToDiceBearAvatars avatarURL={diceBearAvatarInfo.svg} />
                  </ActionPanel>
                }
              />
            );
          })}
        </List.Section>
      )}
    </List>
  );
}
