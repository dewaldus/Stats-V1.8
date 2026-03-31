#include "bindings.h"
#import <UIKit/UIKit.h>

namespace ffi {
    extern "C" {
        void start_app() {
            // Create the application
            @autoreleasepool {
                UIApplicationMain(0, nil, nil, NSStringFromClass([UIResponder class]));
            }
        }
    }
}
