import { ActionPanel, Detail, List, Action, Icon, Color } from "@raycast/api";
import { useFetch, MutatePromise } from "@raycast/utils";
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
    [key: string]: string;
  };
};

export default function Command() {
  const [token, setToken] = useState<string>("eth");
  const [explorerUrl, setExplorerUrl] = useState<string>("https://etherscan.io/");
  const [apiUrl, setApiUrl] = useState<string>("https://api.etherscan.io/");
  const {
    isLoading: gasLoading,
    data: gasData,
    revalidate: gasRevalidate,
    mutate,
  } = useFetch<gasResp>(`${apiUrl}api?module=gastracker&action=gasoracle`, {
    keepPreviousData: true,
    onData: (data) => {
      console.log(data);
      if (data.status !== "1") {
        gasRevalidate();
      }
    },
  });
  const {
    isLoading: priceLoading,
    data: priceData,
    revalidate: priceRevalidate,
  } = useFetch<priceResp>(`${apiUrl}api?module=stats&action=${token}price`, {
    keepPreviousData: true,
    onData: (data) => {
      console.log(data);
      if (data.status !== "1") {
        priceRevalidate();
      }
    },
  });
  const {
    LastBlock,
    SafeGasPrice: lowPrice,
    ProposeGasPrice: avgPrice,
    FastGasPrice: fastPrice,
  } = gasData?.result || {};
  const tokenPrice = priceData?.result[token + "usd"];

  function refresh() {
    gasRevalidate();
    priceRevalidate();
  }
  function returnList(isLoading: boolean) {
    if (!isLoading) {
      return (
        <List
          navigationTitle="Show Current Gas"
          isLoading={isLoading}
          searchBarAccessory={
            <List.Dropdown
              tooltip="Select Network"
              defaultValue="eth"
              storeValue={true}
              onChange={(value) => {
                if (value === "eth") {
                  setApiUrl("https://api.etherscan.io/");
                  setExplorerUrl("https://etherscan.io/");
                  setToken(value);
                } else if (value === "matic") {
                  setApiUrl("https://api.polygonscan.com/");
                  setExplorerUrl("https://polygonscan.com/");
                  setToken(value);
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
            subtitle={"$" + tokenPrice}
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
            subtitle={lowPrice + " Gwei"}
            actions={
              <ActionPanel>
                <Action title="Refresh" onAction={() => refresh()} />
              </ActionPanel>
            }
            accessories={[{ text: `$${tokenPrice}` }]}
          />
          <List.Item
            icon={{
              source: Icon.CircleFilled,
              tintColor: Color.Yellow,
            }}
            title="Average"
            subtitle={avgPrice + " Gwei"}
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
            subtitle={fastPrice + " Gwei"}
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
    } else {
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
                  setToken(value);
                } else if (value === "matic") {
                  setApiUrl("https://api.polygonscan.com/");
                  setExplorerUrl("https://polygonscan.com/");
                  setToken(value);
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
              source: Icon.Info,
              tintColor: Color.Blue,
            }}
            title="Loading..."
            actions={
              <ActionPanel>
                <Action title="Refresh" onAction={() => refresh()} />
              </ActionPanel>
            }
          />
        </List>
      );
    }
  }

  return returnList(LastBlock === undefined || tokenPrice === undefined);
}
