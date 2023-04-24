import { ActionPanel, Detail, List, Action, Icon, Color } from "@raycast/api";
import { useFetch } from "@raycast/utils";

type gasResp = {
  low: number;
  average: number;
  high: number;
};

export default function Command() {
  const { isLoading, data, revalidate } = useFetch<gasResp>("https://api.0x3.studio/gas");
  const { low, average, high } = data || {};

  return (
    <List isLoading={isLoading}>
      <List.Item
        icon={{
          source: Icon.CircleFilled,
          tintColor: Color.Green,
        }}
        title="Low"
        subtitle={low + " Gwei"}
        actions={
          <ActionPanel>
            <Action title="Reload" onAction={() => revalidate()} />
          </ActionPanel>
        }
      />
      <List.Item
        icon={{
          source: Icon.CircleFilled,
          tintColor: Color.Yellow,
        }}
        title="Average"
        subtitle={average + " Gwei"}
        actions={
          <ActionPanel>
            <Action title="Reload" onAction={() => revalidate} />
          </ActionPanel>
        }
      />
      <List.Item
        icon={{
          source: Icon.CircleFilled,
          tintColor: Color.Red,
        }}
        title="High"
        subtitle={high + " Gwei"}
        actions={
          <ActionPanel>
            <Action title="Reload" onAction={() => revalidate} />
          </ActionPanel>
        }
      />
      <List.Item
        icon={{
          source: Icon.ArrowRightCircleFilled,
          tintColor: Color.Blue,
        }}
        title="Go to EtherScan"
        actions={
          <ActionPanel>
            <Action.OpenInBrowser url="https://etherscan.io/gastracker" />
          </ActionPanel>
        }
      />
    </List>
  );
}
