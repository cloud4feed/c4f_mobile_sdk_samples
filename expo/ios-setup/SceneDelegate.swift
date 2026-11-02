import UIKit
import React

// Apps built with the iOS 27 SDK must use the UIScene life cycle, otherwise they close at launch.
// Expo SDK 54 creates its window in the app delegate; this moves it into the scene.
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    guard let windowScene = scene as? UIWindowScene,
          let app = UIApplication.shared.delegate as? AppDelegate else { return }
    let root = app.window?.rootViewController
    app.window?.rootViewController = nil

    let window = UIWindow(windowScene: windowScene)
    window.rootViewController = root
    self.window = window
    app.window = window
    window.makeKeyAndVisible()

    if let url = connectionOptions.urlContexts.first?.url {
      RCTLinkingManager.application(UIApplication.shared, open: url, options: [:])
    }
  }

  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    if let url = URLContexts.first?.url {
      RCTLinkingManager.application(UIApplication.shared, open: url, options: [:])
    }
  }
}
