import { ActionPanel, Detail, List, Action, Icon, Color } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";

type gasResp = {
  status: string;
  message: string;
  result: {
    LastBlock: string;
    SafeGasPrice: string;
    ProposeGasPrice: string;
    FastGasPrice: string;
    suggestBaseFee: string;
    gasUsedRatio: string;
  };
};

type priceResp = {
  status: string;
  message: string;
  result: {
    ethbtc: string;
    ethbtc_timestamp: string;
    ethusd: string;
    ethusd_timestamp: string;
  }
};

export default function Command() {
  const [token, setToken] = useState<string>("");
  const [explorerUrl, setExplorerUrl] = useState<string>("");
  const [apiUrl, setApiUrl] = useState<string>("");
  const { isLoading: gasLoading, data: gasData, revalidate: gasRevalidate } = useFetch<gasResp>(`${apiUrl}api?module=gastracker&action=gasoracle`);
  const { isLoading: priceLoading, data: priceData, revalidate: priceRevalidate } = useFetch<priceResp>(`${apiUrl}api?module=stats&action=${token}price`);
  const { LastBlock, SafeGasPrice, ProposeGasPrice, FastGasPrice } = gasData?.result || {};
  const { ethusd } = priceData?.result || {};

  function refresh() {
    gasRevalidate(); gasRevalidate()
  }

  return (
    <List
      navigationTitle="Show Current Gas"
      isLoading={gasLoading || priceLoading}  
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Network"
          defaultValue="eth"
          storeValue={true}
          onChange={(value) => {
            if (value === "eth") {
              setApiUrl("https://api.etherscan.io/");
              setExplorerUrl("https://etherscan.io/");
              setToken(value)
            } else if (value === "matic") {
              setApiUrl("https://api.polygonscan.com/");
              setExplorerUrl("https://polygonscan.com/");
              setToken(value)
            }
          }}
        >
          <List.Dropdown.Item title="Ethereum" value="eth" />
          <List.Dropdown.Item title="Polygon" value="matic" />
        </List.Dropdown>
      }
    >
      <List.Item
        icon={{
          source: Icon.Coins,
          tintColor: Color.Orange,
        }}
        title="Current Price (USD)"
        subtitle={}
        actions={
          <ActionPanel>
            <Action title="Refresh" onAction={() => refresh()} />
          </ActionPanel>
        }
      />
      <List.Item
        icon={{
          source: Icon.CircleFilled,
          tintColor: Color.Green,
        }}
        title="Low"
        subtitle={SafeGasPrice + " Gwei"}
        actions={
          <ActionPanel>
            <Action title="Refresh" onAction={() => refresh()} />
          </ActionPanel>
        }
      />
      <List.Item
        icon={{
          source: Icon.CircleFilled,
          tintColor: Color.Yellow,
        }}
        title="Average"
        subtitle={ProposeGasPrice + " Gwei"}
        actions={
          <ActionPanel>
            <Action title="Refresh" onAction={() => refresh()} />
          </ActionPanel>
        }
      />
      <List.Item
        icon={{
          source: Icon.CircleFilled,
          tintColor: Color.Red,
        }}
        title="High"
        subtitle={FastGasPrice + " Gwei"}
        actions={
          <ActionPanel>
            <Action title="Refresh" onAction={() => refresh()} />
          </ActionPanel>
        }
      />
      <List.Item
        icon={{
          source: Icon.EditShape,
          tintColor: Color.Blue,
        }}
        title="Last Block"
        subtitle={LastBlock}
        actions={
          <ActionPanel>
            <Action title="Refresh" onAction={() => refresh()} />
          </ActionPanel>
        }
      />
      <List.Item
        icon={{
          source: Icon.ArrowRightCircleFilled,
          tintColor: Color.Blue,
        }}
        title="Go to Gas Tracker"
        actions={
          <ActionPanel>
            <Action.OpenInBrowser url={explorerUrl + "/gastracker"} />
          </ActionPanel>
        }
      />
    </List>
  );
}
